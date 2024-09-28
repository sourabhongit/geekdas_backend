const express =  require('express');
const router = express.Router();
const AuthController = require('../../Controller/Auth/AuthController');

// Admin Dashboard
router.get('/login', AuthController.login);

module.exports = router;