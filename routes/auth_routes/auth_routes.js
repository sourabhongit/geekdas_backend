const express = require('express');
const router = express.Router();
const auth_controller = require('../../controller/auth/auth_controller');
const { is_authenticated, redirect_if_authenticated } = require("../../middlewares/auth_middleware");

// Route prefix "/admin/auth"

router.get('/login', redirect_if_authenticated, auth_controller.login);
router.post('/login/store', redirect_if_authenticated, auth_controller.login_store);
router.post('/logout', is_authenticated, auth_controller.logout);

module.exports = router;