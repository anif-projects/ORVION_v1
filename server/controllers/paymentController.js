const enrollmentRepo = require('../repositories/enrollmentRepo');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Event = require('../models/Event');
const EventEnrollment = require('../models/EventEnrollment');
const emailService = require('../services/emailService');
const { getRazorpayInstance } = require('../config/payment');
const crypto = require('crypto');

const checkout = asyncHandler(async (req, res) => {
  const { type, id } = req.body;
  const studentId = req.user.id;

  if (!type || !id) {
    throw new AppError('Type (course/event) and ID are required.', 400);
  }

  if (type === 'course') {
    const exists = await enrollmentRepo.findByStudentAndCourse(studentId, id);
    if (exists) {
      throw new AppError('You are already enrolled in this course.', 400);
    }

    const course = await Course.findById(id);
    if (!course) {
      throw new AppError('Course not found.', 404);
    }

    // Free course logic
    if (!course.price || course.price === 0) {
      const enrollment = await enrollmentRepo.createEnrollment(studentId, id);
      return res.status(200).json({
        status: 'success',
        data: {
          isPaid: false,
          message: 'Enrolled in free course successfully!',
          enrollment,
        }
      });
    }

    // Paid course logic
    const razorpay = getRazorpayInstance();
    let orderId = `MOCK-ORD-${Date.now()}`;
    const amount = Number(course.price);

    if (razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: Math.round(amount * 100), // in paise
          currency: 'INR',
          receipt: `receipt_course_${id}_${Date.now()}`,
        });
        orderId = order.id;
      } catch (err) {
        console.warn('Razorpay course order creation failed, falling back to mock order:', err.message);
        orderId = `MOCK-ORD-${Date.now()}`;
      }
    }

    // Create pending payment entry
    await Payment.create({
      student: studentId,
      course: id,
      amount,
      currency: 'INR',
      provider: 'razorpay',
      transactionId: orderId,
      status: 'pending',
    });

    res.status(200).json({
      status: 'success',
      data: {
        isPaid: true,
        orderId,
        amount: amount * 100, // Frontend expects paise for Razorpay config
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey_123',
      }
    });

  } else if (type === 'event') {
    const event = await Event.findById(id);
    if (!event) {
      throw new AppError('Event not found.', 404);
    }

    // Check event enrollment
    const exists = await EventEnrollment.findOne({ eventId: id, email: req.user.email });
    if (exists) {
      throw new AppError('You are already registered for this event.', 400);
    }

    // Free event logic
    if (!event.isPaymentEnabled || !event.paymentAmount || event.paymentAmount === 0) {
      const enrollment = await EventEnrollment.create({
        eventId: id,
        name: req.user.name || 'Student',
        phone: req.user.phone || '0000000000',
        email: req.user.email,
        organization: 'LMS Platform',
        agreedToTerms: true,
        isPaid: false,
      });
      return res.status(200).json({
        status: 'success',
        data: {
          isPaid: false,
          message: 'Registered for event successfully!',
          enrollment,
        }
      });
    }

    // Paid event logic
    const razorpay = getRazorpayInstance();
    let orderId = `MOCK-ORD-${Date.now()}`;
    const amount = Number(event.paymentAmount);

    if (razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: Math.round(amount * 100), // in paise
          currency: 'INR',
          receipt: `receipt_event_${id}_${Date.now()}`,
        });
        orderId = order.id;
      } catch (err) {
        console.warn('Razorpay event order creation failed, falling back to mock order:', err.message);
        orderId = `MOCK-ORD-${Date.now()}`;
      }
    }

    // Create pending payment entry (using mixed/generic fields)
    const p = new Payment({
      student: studentId,
      amount,
      currency: 'INR',
      provider: 'razorpay',
      transactionId: orderId,
      status: 'pending',
    });
    // Set custom/extra field event
    p.event = id;
    await p.save();

    res.status(200).json({
      status: 'success',
      data: {
        isPaid: true,
        orderId,
        amount: amount * 100,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey_123',
      }
    });

  } else {
    throw new AppError('Invalid checkout type specified.', 400);
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, itemId } = req.body;
  const studentId = req.user.id;

  if (!razorpay_order_id || !razorpay_payment_id || !type || !itemId) {
    throw new AppError('Missing payment verification details.', 400);
  }

  // 1. Signature Verification
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret';
  let isVerified = false;

  if (razorpay_signature) {
    const shasum = crypto.createHmac('sha256', keySecret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');
    isVerified = (digest === razorpay_signature);
  } else {
    // If no signature is provided and secret is dummy, fallback verify for test flows
    isVerified = (keySecret === 'your_razorpay_secret');
  }

  if (!isVerified) {
    throw new AppError('Payment signature verification failed. Secure checks failed.', 400);
  }

  // 2. Fetch and complete payment record
  let payment = await Payment.findOne({ transactionId: razorpay_order_id });
  if (!payment) {
    payment = new Payment({
      student: studentId,
      amount: 0,
      currency: 'INR',
      provider: 'razorpay',
      transactionId: razorpay_order_id,
    });
  }

  payment.status = 'completed';
  payment.paymentIntentId = razorpay_payment_id;
  await payment.save();

  // 3. Create actual enrollment & send confirmation email
  if (type === 'course') {
    // Prevent duplicate enrollment
    const exists = await enrollmentRepo.findByStudentAndCourse(studentId, itemId);
    if (!exists) {
      await enrollmentRepo.createEnrollment(studentId, itemId);
    }

    const course = await Course.findById(itemId);
    const itemTitle = course ? course.title : 'Online Course';
    const finalAmount = course ? course.price : payment.amount;

    await emailService.sendPurchaseConfirmation(
      req.user.email,
      req.user.name || 'Student',
      itemTitle,
      finalAmount
    );

  } else if (type === 'event') {
    // Prevent duplicate registration
    const exists = await EventEnrollment.findOne({ eventId: itemId, email: req.user.email });
    if (!exists) {
      await EventEnrollment.create({
        eventId: itemId,
        name: req.user.name || 'Student',
        phone: req.user.phone || '0000000000',
        email: req.user.email,
        organization: 'LMS Platform',
        agreedToTerms: true,
        isPaid: true,
        paymentId: razorpay_payment_id,
      });
    }

    const event = await Event.findById(itemId);
    const itemTitle = event ? event.name : 'Live Seminar';
    const finalAmount = event ? event.paymentAmount : payment.amount;

    await emailService.sendPurchaseConfirmation(
      req.user.email,
      req.user.name || 'Student',
      itemTitle,
      finalAmount
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Payment verified and transaction completed successfully!',
    }
  });
});

const getHistory = asyncHandler(async (req, res) => {
  const history = await Payment.find({ student: req.user.id }).populate('course');
  res.status(200).json({ status: 'success', data: history });
});

module.exports = { checkout, verifyPayment, getHistory };
