const mongoose = require('./config/mongoose-mysql');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('\n❌ Usage: node create-admin.js "<name>" "<email>" "<password>"\n');
    process.exit(1);
  }

  const [name, email, password] = args;

  try {
    // Wait briefly for the MySQL database connection pool to spin up
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      console.error(`\n❌ Error: Admin with email "${email}" already exists!\n`);
      process.exit(1);
    }

    const newAdmin = new Admin({
      name,
      email: email.toLowerCase().trim(),
      password,
    });

    await newAdmin.save();
    console.log(`\n🎉 Successfully created admin account:`);
    console.log(`   Name:  ${name}`);
    console.log(`   Email: ${email}\n`);
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Failed to create admin:', err.message, '\n');
    process.exit(1);
  }
};

createAdmin();
