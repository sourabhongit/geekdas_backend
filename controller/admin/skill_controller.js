const multer = require("multer");
const path = require("path");
const Skill = require("../../models/auth/skill_model");
const upload = require("../../middlewares/multer_middleware");

// For delay testing
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.skill_index = async (req, res) => {
	try {
		const skills = await Skill.find();

		res.render("skill/index", { skills }, (err, html) => {
			if (err) {
				console.error("Error rendering skill/index:", err);
				return res.status(500).send("Error rendering skill page");
			}

			res.render("layouts/admin_main", { Section: html });
		});
	} catch (error) {
		console.error("Database error:", error);
		return res.status(500).send("Error fetching skills from the database");
	}
};

exports.skill_create = (req, res) => {
	let pageHeader = "Add Skill";
	let route = "/admin/skill/store";
	let skill = {};
	res.render("skill/create_or_update", { pageHeader, route, skill }, (err, html) => {
		if (err) {
			return res.status(500).send("Not able to render create page.");
		}
		res.render("layouts/admin_main", { Section: html });
	});
};

exports.skill_store = async (req, res) => {
	const destinationPath = path.join(__dirname, "../../public/storage/skill");
	const filenameFunction = (req, file) => {
		return `skill_${Date.now()}${path.extname(file.originalname)}`;
	};

	const uploadSingle = upload(destinationPath, filenameFunction).single("image");

	// Use the multer upload function
	uploadSingle(req, res, async function (err) {
		if (err) {
			console.error("Multer error:", err);
			return res.status(500).send("Error uploading file.");
		}

		const { name, level, order } = req.body;
		const image = req.file;
		try {
			if (!image) {
				return res.status(400).send("Image upload failed.");
			}

			await Skill.create({
				name: name,
				level: level,
				order: parseInt(order),
				image: image.filename,
			});

			return res.status(200).redirect("/admin/skills");
		} catch (err) {
			console.error("Database error:", err);
			return res.status(400).redirect("/admin/skills/create");
		}
	});
};

exports.skill_edit = async (req, res) => {
	let pageHeader = "Edit Skill";
	let route = "/admin/skill/update";
	let skill = await Skill.findById(req.params.id);
	if (!skill) {
		return res.status(404).send("Not able to fetch skill data.");
	}
	res.render("skill/create_or_update", { pageHeader, route, skill }, (err, html) => {
		if (err) {
			return res.status(500).send("Error rendering dashboard");
		}
		res.render("layouts/admin_main", { Section: html });
	});
};

exports.skill_update = async (req, res) => {
	// Helper function to find and update skill
	const updateSkillData = async (skill, fieldsToUpdate) => {
		Object.keys(fieldsToUpdate).forEach((key) => {
			if (fieldsToUpdate[key] !== undefined) skill[key] = fieldsToUpdate[key];
		});
		await skill.save();
	};

	// Helper function to handle the response
	const handleResponse = (status, message, skill) => {
		return res.status(status).json({ message, skill });
	};

	try {
		const skillId = req.body.id;
		const skill = await Skill.findById(skillId);
		if (!skill) {
			return handleResponse(404, "Skill not found");
		}

		if (req.file) {
			const destinationPath = path.join(__dirname, "../../public/storage/skill");
			const filenameFunction = (req, file) => `skill_${Date.now()}${path.extname(file.originalname)}`;

			const uploadSingle = upload(destinationPath, filenameFunction).single("image");

			uploadSingle(req, res, async (err) => {
				if (err) {
					return res.status(400).json({ message: `File upload failed: ${err.message}` });
				}

				const { name, level, order } = req.body;

				const fieldsToUpdate = {
					name: name || skill.name,
					level: level || skill.level,
					order: order || skill.order,
					image: req.file ? req.file.filename : skill.image,
				};

				await updateSkillData(skill, fieldsToUpdate);
				return handleResponse(200, "Skill updated successfully", skill);
			});
		} else {
			// No image file uploaded; only update other fields
			const { name, level, order } = req.body;

			const fieldsToUpdate = {
				name: name || skill.name,
				level: level || skill.level,
				order: order || skill.order,
			};

			await updateSkillData(skill, fieldsToUpdate);
			return handleResponse(200, "Skill updated successfully", skill);
		}
	} catch (error) {
		console.error("Error updating skill:", error);
		return res.status(500).json({ message: `Internal server error: ${error.message}` });
	}
};
