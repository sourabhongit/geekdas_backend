exports.skill_index = (req, res) => {
	res.render("skill/index", (err, html) => {
		if (err) {
			return res.status(500).send("Error rendering dashboard");
		}
		res.render("layouts/admin_main", { Section: html });
	});
};

exports.skill_create = (req, res) => {
	res.render("skill/create", (err, html) => {
		if (err) {
			return res.status(500).send("Error rendering dashboard");
		}
		res.render("layouts/admin_main", { Section: html });
	});
};

exports.skill_store = (req, res) => {
	const { name, image, level, order } = req.body;
	try {
		console.log(req.body);
	} catch (err) {
		console.log(err);
	}
};
