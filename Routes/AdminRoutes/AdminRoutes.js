const express = require("express");
const router = express.Router();
const DashboardController = require("../../Controller/Admin/DashboardController");
const IsAuthenticated = require("../../Middlewares/AuthMiddleware");

// router.use(IsAuthenticated);

router.get("/dashboard", IsAuthenticated, DashboardController.Dashboard);

module.exports = router;
