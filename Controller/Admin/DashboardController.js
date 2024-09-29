exports.Dashboard = (req, res) => {
	res.render("Admin/Dashboard", (err, html) => {
		if (err) {
			return res.status(500).send("Error rendering dashboard");
		}
		res.render("Layouts/AdminMain", { Section: html });
	});
};
