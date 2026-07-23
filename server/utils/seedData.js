const mongoose = require('../config/mongoose-mysql');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Settings = require('../models/Settings');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect();
    console.log('[Seed] Connected to Database...');

    await User.deleteMany();
    await Category.deleteMany();
    await Course.deleteMany();
    await Module.deleteMany();
    await Lesson.deleteMany();
    await Settings.deleteMany();

    // Create Admin and Student
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@lms.com',
      password: 'password123',
      role: 'super_admin',
      isVerified: true,
    });

    const student = await User.create({
      name: 'Alex Johnson',
      email: 'student@lms.com',
      password: 'password123',
      role: 'student',
      isVerified: true,
    });

    // Create Categories
    const catWeb = await Category.create({ name: 'Web Development', slug: 'web-development', color: '#4F46E5', icon: 'code' });
    const catAI = await Category.create({ name: 'Artificial Intelligence', slug: 'artificial-intelligence', color: '#06B6D4', icon: 'cpu' });
    const catDesign = await Category.create({ name: 'UI/UX Design', slug: 'ui-ux-design', color: '#22C55E', icon: 'layout' });

    // Create Sample Courses
    const course1 = await Course.create({
      title: 'Full-Stack React & Node.js Masterclass',
      slug: 'fullstack-react-nodejs-masterclass',
      subtitle: 'Build scalable modern web applications with clean architecture',
      description: 'Master frontend and backend web development using React, Node.js, Express, MongoDB, and Redux Toolkit with glassmorphism UI design.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      category: catWeb._id,
      instructor: admin._id,
      price: 89.99,
      discountPrice: 49.99,
      level: 'all_levels',
      status: 'published',
      tags: ['React', 'Node.js', 'Clean Architecture', 'Glassmorphism'],
      requirements: ['Basic JavaScript knowledge'],
      learningOutcomes: ['Build enterprise React apps', 'Design RESTful Express APIs', 'Implement JWT & Security'],
      totalDuration: 420,
      totalLessons: 8,
      rating: 4.9,
      enrolledCount: 1420,
    });

    const mod1 = await Module.create({
      course: course1._id,
      title: 'Module 1: Foundations & Architecture',
      order: 1,
    });

    await Lesson.create({
      module: mod1._id,
      course: course1._id,
      title: 'Lesson 1: Introduction to Clean Architecture',
      description: 'Understand controllers, services, repositories, and DTOs.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 600,
      order: 1,
      isPreview: true,
      notes: 'Clean architecture decouples framework code from business rules.',
    });

    await Lesson.create({
      module: mod1._id,
      course: course1._id,
      title: 'Lesson 2: Setting up Express and Mongoose Schemas',
      description: 'Define indexes, aggregate queries, and validation middlewares.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 900,
      order: 2,
      isPreview: false,
    });

    await Settings.create({});

    console.log('[Seed] Database populated successfully!');
    process.exit();
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seed();
