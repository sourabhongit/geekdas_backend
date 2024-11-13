// middlewares/multer.js
const multer = require("multer");
const path = require("path");

// Function to create a multer instance with a dynamic path and filename
const upload = (destinationPath, filenameFunction) => {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, destinationPath);
		},
		filename: function (req, file, cb) {
			const filename = filenameFunction(req, file);
			cb(null, filename);
		},
	});

	return multer({
		storage: storage,
		fileFilter: (req, file, cb) => {
			if (!file) {
				cb(null, true); // Allow empty files
			} else {
				const allowedTypes = /jpeg|jpg|png|gif/;
				const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
				const mimetype = allowedTypes.test(file.mimetype);

				if (extname && mimetype) {
					cb(null, true);
				} else {
					cb(new Error("Only images are allowed"), false);
				}
			}
		},
		limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB file size limit
	});
};

module.exports = upload;
