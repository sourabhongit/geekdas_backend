const User = require('../../Models/Auth/UserModel');

exports.Login = (req, res) => {
	res.render("Auth/Login");
};

exports.LoginStore = (req, res) => {
	const { username, password } = req.body;
	const user = User.findUser(username);

	if (user && user.password === password) {
		 res.redirect('/admin/dashboard');
	} else {
		 res.render('/login', { error: 'Invalid username or password' });
	}
};