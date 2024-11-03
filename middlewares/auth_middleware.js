// Middleware on routes that require the user to be logged in.
function is_authenticated(req, res, next) {
    // Check if user session exists
    if (req.session && req.session.userId) {
        return next();
    }
    // No session, redirect to login
    res.redirect('/admin/auth/login');
}

// Middleware on the login route to prevent logged-in users from accessing it.
function redirect_if_authenticated(req, res, next) {
    // If user is already logged in, redirect to dashboard
    if (req.session && req.session.userId) {
        return res.redirect('/admin/dashboard');
    }
    next();
}

module.exports = { is_authenticated, redirect_if_authenticated };
