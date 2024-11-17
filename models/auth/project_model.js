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
		title: {
			type: String,
			required: true,
			trim: true,
		},
		subTitle: {
			type: String,
			required: true,
			minlength: 1,
			trim: true,
		},
		description: {
			type: String,
			required: false,
			trim: true,
		},
		status: {
			type: String,
			enum: ["pending", "in-progress", "completed", "archived"],
			default: "pending",
		},
		liveStatus: {
			type: Boolean,
			default: false,
		},
		displayPriority: {
			type: Number,
			required: false,
			default: 0,
		},
		clientReview: {
			rating: {
				type: Number,
				min: 1,
				max: 5,
				required: false,
			},
			feedback: {
				type: String,
				required: false,
				trim: true,
			},
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

ProjectSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = mongoose.model("Project", ProjectSchema);
