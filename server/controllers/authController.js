const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const mongoose = require('../config/mongoose-mysql');
const emailService = require('../services/emailService');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ status: 'success', data: result });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOTP(email, otp);
  res.status(200).json({ status: 'success', data: result });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({ status: 'success', data: result });
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.adminLogin(email, password);
  res.status(200).json({ status: 'success', data: result });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    status: 'success',
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      study_mon: user.study_mon || 0,
      study_tue: user.study_tue || 0,
      study_wed: user.study_wed || 0,
      study_thu: user.study_thu || 0,
      study_fri: user.study_fri || 0,
      study_sat: user.study_sat || 0,
      study_sun: user.study_sun || 0,
      study_week_start: user.study_week_start || '',
    }
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, phone } = req.body;
  
  const student = await User.findById(userId);
  if (!student) {
    return res.status(404).json({ status: 'fail', message: 'Student not found' });
  }
  
  student.name = name;
  student.phone = phone || '';
  await student.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      name: student.name,
      phone: student.phone,
    }
  });
});

const trackStudyTime = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { seconds } = req.body;
  
  if (seconds === undefined || isNaN(seconds)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid seconds value' });
  }

  const student = await User.findById(userId);
  if (!student) {
    return res.status(404).json({ status: 'fail', message: 'Student not found' });
  }

  // Get current Monday date string in YYYY-MM-DD
  const getMondayDateString = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(d.setDate(diff));
    return mon.toISOString().split('T')[0];
  };

  const currentMonday = getMondayDateString();

  // If new week (or empty), reset study fields
  if (student.study_week_start !== currentMonday) {
    student.study_mon = 0;
    student.study_tue = 0;
    student.study_wed = 0;
    student.study_thu = 0;
    student.study_fri = 0;
    student.study_sat = 0;
    student.study_sun = 0;
    student.study_week_start = currentMonday;
  }

  // Increment current day of week (sun, mon, tue, wed, thu, fri, sat)
  const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentDayName = daysOfWeek[new Date().getDay()];
  const key = `study_${currentDayName}`;

  // Add the minutes (seconds / 60)
  const minutesToAdd = Number(seconds) / 60;
  student[key] = (student[key] || 0) + minutesToAdd;

  await student.save();

  res.status(200).json({
    status: 'success',
    data: {
      study_mon: student.study_mon,
      study_tue: student.study_tue,
      study_wed: student.study_wed,
      study_thu: student.study_thu,
      study_fri: student.study_fri,
      study_sat: student.study_sat,
      study_sun: student.study_sun,
      study_week_start: student.study_week_start,
    }
  });
});const getNotifications = asyncHandler(async (req, res) => {
  const user = req.user;
  const clientHour = Number(req.query.clientHour) !== undefined && !isNaN(Number(req.query.clientHour))
    ? Number(req.query.clientHour)
    : new Date().getHours();
  
  const notifications = [];

  if (user.role === 'admin' || user.role === 'super_admin') {
    // Admin notifications: new student enrollments (registered in the last 48 hours)
    const [recentStudents] = await mongoose.query(
      "SELECT `name`, `email`, `createdAt` FROM `students` ORDER BY `createdAt` DESC LIMIT 10"
    );
    
    recentStudents.forEach(st => {
      const diffMs = Date.now() - new Date(st.createdAt).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours <= 48) {
        notifications.push({
          id: `st-${st.email}`,
          title: 'New Student Enrolled',
          message: `${st.name} (${st.email}) has created an account.`,
          time: new Date(st.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'student_enroll'
        });
      }
    });
  } else {
    // Student notifications: new events or new courses launched in last 3 days
    const [recentCourses] = await mongoose.query(
      "SELECT `title`, `createdAt` FROM `courses` WHERE `type` != 'offline' ORDER BY `createdAt` DESC LIMIT 5"
    );
    const [recentEvents] = await mongoose.query(
      "SELECT `name`, `createdAt` FROM `events` ORDER BY `createdAt` DESC LIMIT 5"
    );

    recentCourses.forEach(c => {
      const diffMs = Date.now() - new Date(c.createdAt).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours <= 72) {
        notifications.push({
          id: `course-${c.title}`,
          title: 'New Course Launched 🚀',
          message: `Explore the new course: "${c.title}" now available.`,
          time: 'Recently',
          type: 'new_course'
        });
      }
    });

    recentEvents.forEach(e => {
      const diffMs = Date.now() - new Date(e.createdAt).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours <= 72) {
        notifications.push({
          id: `event-${e.name}`,
          title: 'New Seminar Scheduled 📅',
          message: `Join the live session: "${e.name}". Register in Live Hub.`,
          time: 'Recently',
          type: 'new_event'
        });
      }
    });

    // Daily reminders at 6 AM, 12 PM, and 6 PM
    if (clientHour >= 6) {
      notifications.push({
        id: 'reminder-6am',
        title: 'Morning Study Reminder (06:00 AM)',
        message: "Start your morning with a fresh lesson. Keep up your daily study streak!",
        time: '06:00 AM',
        type: 'reminder'
      });
    }
    if (clientHour >= 12) {
      notifications.push({
        id: 'reminder-12pm',
        title: 'Midday Review Reminder (12:00 PM)',
        message: "Time for a quick learning session. Review your active courses!",
        time: '12:00 PM',
        type: 'reminder'
      });
    }
    if (clientHour >= 18) {
      notifications.push({
        id: 'reminder-6pm',
        title: 'Evening Progress Reminder (06:00 PM)',
        message: "Reflect on today's progress and schedule your learning goals.",
        time: '06:00 PM',
        type: 'reminder'
      });
    }
  }

  res.status(200).json({
    status: 'success',
    data: { notifications }
  });
});
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError('Email address is required.', 400);
  }

  const student = await User.findOne({ email: email.toLowerCase().trim() });
  if (!student) {
    throw new AppError('Student with this email address does not exist.', 404);
  }

  // Rate limiting check: 3 resets per day max
  const todayStr = new Date().toISOString().split('T')[0];
  if (student.last_reset_date === todayStr && student.reset_count >= 3) {
    throw new AppError('You have reached the maximum limit of 3 password resets per day.', 400);
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  student.reset_otp = otpCode;
  student.reset_otp_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await student.save();

  // Send OTP
  await emailService.sendResetOTP(student.email, otpCode);

  res.status(200).json({
    status: 'success',
    message: 'Verification OTP has been sent to your email.'
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    throw new AppError('Email, verification OTP, and new password are required.', 400);
  }

  const student = await User.findOne({ email: email.toLowerCase().trim() });
  if (!student) {
    throw new AppError('Student with this email address does not exist.', 404);
  }

  // Rate limiting double-check
  const todayStr = new Date().toISOString().split('T')[0];
  if (student.last_reset_date === todayStr && student.reset_count >= 3) {
    throw new AppError('You have reached the maximum limit of 3 password resets per day.', 400);
  }

  // OTP Check
  if (!student.reset_otp || student.reset_otp !== otp) {
    throw new AppError('Invalid verification OTP code.', 400);
  }

  if (new Date() > new Date(student.reset_otp_expires)) {
    throw new AppError('Verification OTP has expired.', 400);
  }

  // Increment daily counter upon successful reset
  if (student.last_reset_date === todayStr) {
    student.reset_count = (student.reset_count || 0) + 1;
  } else {
    student.last_reset_date = todayStr;
    student.reset_count = 1;
  }

  // Reset password & clear OTP fields
  student.password = newPassword;
  student.reset_otp = null;
  student.reset_otp_expires = null;
  await student.save();

  res.status(200).json({
    status: 'success',
    message: 'Password has been reset successfully.'
  });
});

module.exports = {
  register,
  verifyOTP,
  login,
  adminLogin,
  getMe,
  getProfile,
  updateProfile,
  trackStudyTime,
  getNotifications,
  forgotPassword,
  resetPassword,
};
