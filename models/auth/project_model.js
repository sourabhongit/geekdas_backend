const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
		},
		image: {
			type: String,
			required: true,
			trim: true,
		},
		level: {
			type: String,
			required: true,
			enum: ["beginner", "intermediate", "advanced"],
			trim: true,
		},
		order: {
			type: Number,
			required: true,
			unique: true,
			min: 1,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Project", ProjectSchema);
