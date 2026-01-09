const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { connection } = require("../db/db");
require("dotenv").config();

const seedAdmin = async () => {
  try {
    await connection();

    const adminEmail = "admin@cineluxe.com";
    const adminPassword = "admin123";
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const password_hash = await bcrypt.hash(adminPassword, 10);

    await User.create({
      fullname: "Admin User",
      email: adminEmail,
      password_hash,
      role: "admin",
    });

    console.log("Admin user created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
