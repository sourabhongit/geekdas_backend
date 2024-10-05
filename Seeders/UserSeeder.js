const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../Models/Auth/UserModel");

// Connect to MongoDB
const DBUri = process.env.MONGO_URI;

mongoose.connect(DBUri);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error: " + err);
});

// Sample users
const users = [
  {
    username: "admin",
    password: "abc2@bcr",
    isVerified: true,
  }
];

// Hash password and insert users into the database
const SeedUsers = async () => {
  try {
    // Clear existing users (optional)
    await User.deleteMany({});
    console.log("All existing users removed");

    // Hash passwords and insert users
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    }

    // Insert users into the database
    await User.insertMany(users);
    console.log("Users seeded successfully");

    // Close the MongoDB connection
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding users:", err);
    mongoose.connection.close();
  }
};

// Run the seeder
SeedUsers();
