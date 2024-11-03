const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		sessions: [
			{
				sessionId: {
					type: String,
				},
				expires: {
					type: Date,
				},
				userAgent: {
					type: String,
				},
				ipAddress: {
					type: String,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		// To track last login date
		lastLogin: {
			type: Date,
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
);

// Hash password before saving user
UserSchema.pre("save", async function (next) {
	const user = this;
	if (!user.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(user.password, salt);
		user.password = hash;
		next();
	} catch (err) {
		return next(err);
	}
});

// Compare input password with stored hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Optionally, add a method to add session data
UserSchema.methods.addSession = function (sessionId, expires, userAgent, ipAddress) {
	this.sessions.push({ sessionId, expires, userAgent, ipAddress });
	return this.save();
};

// Optionally, add a method to remove a session by sessionId
UserSchema.methods.removeSession = function (sessionId) {
	this.sessions = this.sessions.filter((session) => session.sessionId !== sessionId);
	return this.save();
};

module.exports = mongoose.model("User", UserSchema);
