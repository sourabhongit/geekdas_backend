module.exports = function isAuthenticated(req, res, next) {
   if (req.session && req.session.user) {
       return next();
   }
   res.redirect('/admin/auth/login');
};