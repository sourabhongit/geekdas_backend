const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Project = require("../../models/auth/project_model");
const upload = require("../../middlewares/multer_middleware");

exports.project_index = async (req, res) => {
	try {
		const projects = await Project.find();

		res.render("project/index", { projects }, (err, html) => {
			if (err) {
				console.error("Error rendering project/index:", err);
				return res.status(500).send("Error rendering project page");
			}

			res.render("layouts/admin_main", { Section: html });
		});
	} catch (error) {
		console.error("Database error:", error);
		return res.status(500).send("Error fetching projects from the database");
	}
};

exports.project_create = (req, res) => {
	res.render("project/create", (err, html) => {
		if (err) {
			return res.status(500).send("Error rendering dashboard");
		}
		res.render("layouts/admin_main", { Section: html });
	});
};

exports.project_store = async (req, res) => {
	const destinationPath = path.join(__dirname, "../../public/storage/project");
	const filenameFunction = (req, file) => {
		return `project_${Date.now()}${path.extname(file.originalname)}`;
	};

	const uploadSingle = upload(destinationPath, filenameFunction).single("image");

	// Use the multer upload function
	uploadSingle(req, res, async function (err) {
		if (err) {
			console.error("Multer error:", err);
			return res.status(500).send("Error uploading file.");
		}

		const { 
			name,
			title,
			subTitle,
			description,
			status,
			liveStatus,
			displayPriority,
			rating,
			feedback
		} = req.body;
		const image = req.file;
		try {
			if (!image) {
				return res.status(400).send("Image upload failed.");
			}

			await Project.create({
				name: name,
				image: '/storage/project' + image.filename,
				title: title,
				subTitle: subTitle,
				description: description,
				status: status,
				liveStatus: liveStatus,
				displayPriority: displayPriority,
				rating: rating,
				feedback: feedback
			});

			return res.status(200).redirect("/admin/projects");
		} catch (err) {
			console.error("Database error:", err);
			return res.status(400).redirect("/admin/project/create");
		}
	});
};

exports.project_edit = async (req, res) => {
	let project = await Project.findById(req.params.id);
	let pageHeader = "Edit Project";
	let route = "/admin/project/update";
	if (!skill) {
		return res.status(404).send("Not able to fetch skill data.");
	}
	res.render("project/create_or_update", { pageHeader, route, project }, (err, html) => {
		if (err) {
			return res.status(500).send("Error rendering dashboard");
		}
		res.render("layouts/admin_main", { Section: html });
	});
};

exports.project_update = async (req, res) => {
	const destinationPath = path.join(__dirname, "../../public/storage/project");
	const filenameFunction = (req, file) => {
		return `project_${Date.now()}${path.extname(file.originalname)}`;
	};
	const uploadSingle = upload(destinationPath, filenameFunction).single("image");
	uploadSingle(req, res, async (err) => {
		if (err) {
			console.error("File upload failed:", err);
			return res.redirect("back");
		}

		try {
			const project_id = req.body.id;
			const project = await Project.findById(project_id);
			if (!project) {
				return res.redirect("back");
			}

			const { name, level, order } = req.body;

			// Update only the fields that are provided
			const fieldsToUpdate = {
				name: name || project.name,
				level: level || project.level,
				order: order || project.order,
			};

			// If there's an uploaded file, update the image path
			if (req.file) {
				// Define the path to the existing file
				const oldImagePath = path.join(__dirname, "../../public/storage/project", project.image);

				// Delete the old file if it exists
				if (project.image && fs.existsSync(oldImagePath)) {
					fs.unlink(oldImagePath, (err) => {
						if (err) {
							console.error("Error deleting old image:", err);
						}
					});
				}

				// Update the new image path
				fieldsToUpdate.image = req.file.filename;
			}

			// Update the project object
			Object.assign(project, fieldsToUpdate);
			await project.save();

			return res.redirect("/admin/projects");
		} catch (error) {
			console.error("Error updating skill:", error);
			return res.redirect("back");
		}
	});
};