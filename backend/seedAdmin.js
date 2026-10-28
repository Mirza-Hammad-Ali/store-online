
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

async function seedAdmin() {
  try {
    const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } =
      process.env;

    if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin and MongoDB environment variables are required.");
    }

    if (ADMIN_PASSWORD.length < 12 || ADMIN_PASSWORD.length > 128) {
      throw new Error("Set an admin password between 12 and 128 characters.");
    }

    await mongoose.connect(MONGODB_URI);

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role !== "admin") {
        throw new Error(
          "This email already belongs to a normal user. Choose a different admin email."
        );
      }

      console.log("Admin account already exists. No changes made.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: ADMIN_NAME,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
