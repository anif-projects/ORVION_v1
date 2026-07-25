require('dotenv').config();
const mongoose = require('./config/mongoose-mysql');
const Course = require('./models/Course');
const Admin = require('./models/Admin');

(async () => {
  await mongoose.connect();
  
  console.log("1. Finding all courses...");
  const allCourses = await Course.find({});
  console.log("All courses raw length:", allCourses.length);
  
  console.log("2. Finding all admins...");
  const allAdmins = await Admin.find({});
  console.log("All admins length:", allAdmins.length);

  process.exit(0);
})().catch(console.error);
