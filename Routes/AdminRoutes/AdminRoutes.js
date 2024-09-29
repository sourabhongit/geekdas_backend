const express =  require('express');
const router = express.Router();
const DashboardController = require('../../Controller/Admin/DashboardController');

router.get('/dashboard', DashboardController.Dashboard);
module.exports = router;