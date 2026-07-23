const { getStripeInstance, getRazorpayInstance } = require('../config/payment');
const paymentRepo = require('../repositories/paymentRepo');
const enrollmentRepo = require('../repositories/enrollmentRepo');
const AppError = require('../utils/appError');

class PaymentService {
  async processCheckout({ studentId, courseId, price, provider = 'stripe' }) {
    if (price === 0) {
      // Free Course Enrollment
      const transactionId = `FREE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const payment = await paymentRepo.createPayment({
        student: studentId,
        course: courseId,
        amount: 0,
        provider: 'free',
        transactionId,
        status: 'completed',
      });
      await enrollmentRepo.createEnrollment(studentId, courseId, payment._id);
      return { success: true, message: 'Enrolled in free course successfully!', payment };
    }

    if (provider === 'stripe') {
      const stripe = getStripeInstance();
      if (!stripe) {
        // Mock Stripe fallback for development
        const mockTx = `STRIPE-MOCK-${Date.now()}`;
        const payment = await paymentRepo.createPayment({
          student: studentId,
          course: courseId,
          amount: price,
          provider: 'stripe',
          transactionId: mockTx,
          status: 'completed',
        });
        await enrollmentRepo.createEnrollment(studentId, courseId, payment._id);
        return { success: true, clientSecret: 'mock_stripe_secret', payment };
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: `Course ID: ${courseId}` },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/courses`,
      });

      const payment = await paymentRepo.createPayment({
        student: studentId,
        course: courseId,
        amount: price,
        provider: 'stripe',
        transactionId: session.id,
        status: 'pending',
      });

      return { checkoutUrl: session.url, paymentId: payment._id };
    } else if (provider === 'razorpay') {
      const razorpay = getRazorpayInstance();
      if (!razorpay) {
        const mockTx = `RZP-MOCK-${Date.now()}`;
        const payment = await paymentRepo.createPayment({
          student: studentId,
          course: courseId,
          amount: price,
          provider: 'razorpay',
          transactionId: mockTx,
          status: 'completed',
        });
        await enrollmentRepo.createEnrollment(studentId, courseId, payment._id);
        return { success: true, orderId: mockTx, payment };
      }

      const order = await razorpay.orders.create({
        amount: price * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });

      const payment = await paymentRepo.createPayment({
        student: studentId,
        course: courseId,
        amount: price,
        provider: 'razorpay',
        transactionId: order.id,
        status: 'pending',
      });

      return { orderId: order.id, amount: order.amount, currency: order.currency, paymentId: payment._id };
    } else {
      throw new AppError('Unsupported payment provider', 400);
    }
  }
}

module.exports = new PaymentService();
