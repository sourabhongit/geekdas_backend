require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../Models/Auth/UserModel");

// Connect to MongoDB
const ConnectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB connected successfully for seeding");
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};

// Create seed data
const SeedUsers = async () => {
	try {
		// Define the seed data
		const users = [{ username: "admin", password: "abc2@bcr" }];

		// Clear existing users in the database
		await User.deleteMany({});
		console.log("Users collection cleared");

		// Insert new seed data
		await User.insertMany(users);
		console.log("Users seeded successfully");

		// Close the connection
		mongoose.connection.close();
	} catch (error) {
		console.error("Error seeding users:", error);
		mongoose.connection.close();
	}
};

// Run the seeder
const RunSeeder = async () => {
	await ConnectDB();
	await SeedUsers();
};

RunSeeder();
