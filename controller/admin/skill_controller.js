const multer = require("multer");
const path = require("path");
const fs = require("fs");
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
	let skill = await Skill.findById(req.params.id);
	let pageHeader = "Edit Skill";
	let route = "/admin/skill/update";
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
	const destinationPath = path.join(__dirname, "../../public/storage/skill");
	const filenameFunction = (req, file) => {
		return `skill_${Date.now()}${path.extname(file.originalname)}`;
	};
	const uploadSingle = upload(destinationPath, filenameFunction).single("image");
	uploadSingle(req, res, async (err) => {
		if (err) {
			console.error("File upload failed:", err);
			return res.redirect("back");
		}

		try {
			const skillId = req.body.id;
			const skill = await Skill.findById(skillId);
			if (!skill) {
				return res.redirect("back");
			}

			const { name, level, order } = req.body;

			const fieldsToUpdate = {
				name: name || skill.name,
				level: level || skill.level,
				order: order || skill.order,
			};

			if (req.file) {
				const oldImagePath = path.join(__dirname, "../../public/storage/skill", skill.image);

				if (skill.image && fs.existsSync(oldImagePath)) {
					fs.unlink(oldImagePath, (err) => {
						if (err) {
							console.error("Error deleting old image:", err);
						}
					});
				}

				fieldsToUpdate.image = req.file.filename;
			}

			Object.assign(skill, fieldsToUpdate);
			await skill.save();

			return res.redirect("/admin/skills");
		} catch (error) {
			console.error("Error updating skill:", error);
			return res.redirect("back");
		}
	});
};

exports.skill_delete = async (req, res) => {
	try {
		const skill = await Skill.findById(req.params.id);
		if (!skill) {
			return res.status(404).send("Skill not found.");
		}

		const oldImagePath = path.join(__dirname, "../../public/storage/skill", skill.image);

		if (skill.image && fs.existsSync(oldImagePath)) {
			fs.unlink(oldImagePath, (err) => {
				if (err) {
					console.error("Error deleting old image:", err);
				}
			});
		}
		await skill.deleteOne();
		console.log("Skill deleted successfully.");

		return res.redirect("back");
	} catch (error) {
		console.error("Error deleting skill:", error);
		return res.status(500).send("An error occurred while deleting the skill.");
	}
};
