require('dotenv').config({ path: 'c:/Users/thota yeshwanth/Downloads/LMS/LMS/server/.env' });
const mongoose = require('c:/Users/thota yeshwanth/Downloads/LMS/LMS/server/config/mongoose-mysql');
const Course = require('c:/Users/thota yeshwanth/Downloads/LMS/LMS/server/models/Course');
const Category = require('c:/Users/thota yeshwanth/Downloads/LMS/LMS/server/models/Category');

(async () => {
  await mongoose.connect();
  
  console.log("1. Finding all courses...");
  const allCourses = await Course.find({});
  console.log("All courses raw:", allCourses);

  console.log("2. Finding with status IN...");
  const coursesIn = await Course.find({ status: { $in: ['draft', 'published', 'archived'] } });
  console.log("Courses with status IN:", coursesIn);

  process.exit(0);
})().catch(console.error);
