const bcrypt = require("bcrypt");
const User = require("../../models/auth/user_model");

exports.login = (req, res) => {
	res.render("auth/login");
};

exports.login_store = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username: username });
		if (user) {
			const isMatch = await bcrypt.compare(password, user.password);

			if (isMatch) {
				req.session.userId = user._id;
				// Redirect to dashboard upon successful login
				return res.redirect("/admin/dashboard");
			}
		}

		// If user not found or password does not match, show an error
		res.render("auth/login", { error: "Invalid username or password" });
	} catch (error) {
		console.error("Error during login:", error);
		res.render("auth/login", { error: "An error occurred. Please try again." });
	}
};

exports.logout = async (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			 console.error("Session destruction error:", err);
			 return res.status(500).send('Could not log out. Please try again later.');
		}
		res.redirect('/admin/auth/login');
  });
};