const multer = require("multer");
const path = require("path");
const Project = require("../../models/auth/project_model");

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
	// Set up custom multer storage for this controller function
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "storage/uploads/projects");
		},
		filename: (req, file, cb) => {
			const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
			cb(null, `${req.body.name}-${uniqueSuffix}${path.extname(file.originalname)}`);
		},
	});

	const upload = multer({ storage: storage }).single("image");

	// Use the multer upload function
	upload(req, res, async function (err) {
		if (err) {
			console.error("Multer error:", err);
			return res.status(500).send("Error uploading file.");
		}

		// Access form data and uploaded file
		const { name, level, order } = req.body;
		const image = req.file;

		try {
			// Check if the image was uploaded
			if (!image) {
				return res.status(400).send("Image upload failed.");
			}

			// Insert data into the database
			await Skill.create({
				name: name,
				level: level,
				order: parseInt(order),
				image: image.filename,
			});

			// Redirect to skills page after success
			return res.status(200).redirect("/admin/projects");
		} catch (err) {
			console.error("Database error:", err);
			// Redirect back to the create page with a failure status
			return res.status(400).redirect("/admin/project/create");
		}
	});
};
