const dbAdapter = require('./mongoose-mysql');

const connectDB = async () => {
  try {
    // Connect to MySQL database
    await dbAdapter.connect();

    // Auto-seed initial data for smooth out-of-the-box demo if database is blank
    try {
      const Admin = require('../models/Admin');
      const Course = require('../models/Course');
      const Event = require('../models/Event');
      const User = require('../models/User'); // Students

      // Check if admin exists in MySQL database
      const adminExists = await Admin.findOne({ email: 'tothayeswanth052@gmail.com' });
      if (!adminExists) {
        console.log('[Database Seed] Seeding MySQL database with initial demo data...');

        // 1. Create Default Admin
        await Admin.create({
          name: 'Super Admin',
          email: 'tothayeswanth052@gmail.com',
          password: 'Yeshu@140306',
        });

        // 2. Create Default Student for testing
        const studentExists = await User.findOne({ email: 'student@lms.com' });
        if (!studentExists) {
          await User.create({
            name: 'Demo Student',
            email: 'student@lms.com',
            password: 'password123',
            isVerified: true,
          });
        }

        // 3. Create Default Courses
        await Course.create({
          title: 'Full-Stack React & Node.js Masterclass',
          description: 'Master frontend and backend web development using React, Node.js, Express, and MySQL.',
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
          price: 49.99,
          isFeatured: true,
          category: 'Web Development',
        });

        await Course.create({
          title: 'Introduction to Python programming',
          description: 'Learn python from basics to advanced. Great for beginners!',
          thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          price: 29.99,
          isFeatured: false,
          category: 'Programming',
        });

        // 4. Create Default Live Events
        await Event.create({
          name: 'Tech Career & Resume Webinar',
          description: 'Learn how to construct a stellar resume and prepare for technical interviews.',
          thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
          paymentAmount: 0.00,
          isPaymentEnabled: false,
        });

        await Event.create({
          name: 'React 19 Advanced Features Workshop',
          description: 'Deep dive into server components, actions, and advanced state patterns in React 19.',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
          paymentAmount: 499.00,
          isPaymentEnabled: true,
        });

        console.log('[Database Seed] Auto-seeded default admin (tothayeswanth052@gmail.com / Yeshu@140306) and demo courses/events successfully!');
      }
    } catch (seedErr) {
      console.warn('[Database Seed Warning] Auto-seeding skipped or failed:', seedErr.message);
    }
  } catch (error) {
    console.error(`[Database Error] Critical failure connecting to database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
