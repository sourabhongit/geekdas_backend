exports.skill_index = (req, res) => {
	res.render("skill/index", (err, html) => {
		if (err) {
			return res.status(500).send("Error rendering dashboard");
		}
		res.render("layouts/admin_main", { Section: html });
	});
};
