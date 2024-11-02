const express = require('express');
const router = express.Router();
const AuthController = require('../../Controller/Auth/AuthController');
const { IsAuthenticated, RedirectIfAuthenticated } = require("../../Middlewares/AuthMiddleware");

// Route prefix "/admin/auth"

router.get('/login', RedirectIfAuthenticated, AuthController.Login);
router.post('/login/store', RedirectIfAuthenticated, AuthController.LoginStore);
router.post('/logout', IsAuthenticated, AuthController.Logout);

module.exports = router;