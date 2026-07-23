const dbAdapter = require('./mongoose-mysql');

const connectDB = async () => {
  try {
    // Connect to MySQL database
    await dbAdapter.connect();

    // Auto-seed initial data for smooth out-of-the-box demo if database is blank
    try {
      const User = require('../models/User');
      const Course = require('../models/Course');
      const Category = require('../models/Category');
      const Module = require('../models/Module');
      const Lesson = require('../models/Lesson');
      const Settings = require('../models/Settings');

      // Check if admin exists in MySQL database
      const adminExists = await User.findOne({ email: 'admin@lms.com' });
      if (!adminExists) {
        console.log('[Database Seed] Seeding MySQL database with initial demo data...');

        // 1. Create Default Admin
        const admin = await User.create({
          name: 'Super Admin',
          email: 'admin@lms.com',
          password: 'password123',
          role: 'super_admin',
          isVerified: true,
        });

        // 2. Create Default Category
        const catWeb = await Category.create({ 
          name: 'Web Development', 
          slug: 'web-development', 
          color: '#4F46E5' 
        });

        // 3. Create Default Course
        const course1 = await Course.create({
          title: 'Full-Stack React & Node.js Masterclass',
          slug: 'fullstack-react-nodejs-masterclass',
          subtitle: 'Build scalable modern web applications with clean architecture',
          description: 'Master frontend and backend web development using React, Node.js, Express, MySQL, and Redux Toolkit.',
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
          previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          category: catWeb.id,
          instructor: admin.id,
          price: 89.99,
          discountPrice: 49.99,
          level: 'all_levels',
          status: 'published',
          totalDuration: 420,
          totalLessons: 8,
          rating: 4.9,
          enrolledCount: 1420,
        });

        // 4. Create Default Module
        const mod1 = await Module.create({
          course: course1.id,
          title: 'Module 1: Foundations & Architecture',
          order: 1,
        });

        // 5. Create Default Lesson
        await Lesson.create({
          module: mod1.id,
          course: course1.id,
          title: 'Lesson 1: Introduction to Clean Architecture',
          description: 'Understand controllers, services, repositories, and DTOs.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          duration: 600,
          order: 1,
          isPreview: true,
          notes: 'Clean architecture decouples framework code from business rules.',
          resources: [],
        });

        // 6. Create Initial Site Settings
        await Settings.create({
          siteName: 'Orvion LMS',
          supportEmail: 'support@orvion.com',
          paymentProvider: 'stripe',
          enableSMTP: true,
          themeColor: '#b45309',
          maintenanceMode: false,
        });

        console.log('[Database Seed] Auto-seeded default admin (admin@lms.com / password123), courses, and settings into MySQL Database successfully!');
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
