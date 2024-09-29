const express = require('express');
const router = express.Router();
const AuthController = require('../../Controller/Auth/AuthController');

router.get('/login', AuthController.Login);
router.post('/login/store', AuthController.LoginStore);

module.exports = router;