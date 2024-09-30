const express = require("express");
const router = express.Router();
const DashboardController = require("../../Controller/Admin/DashboardController");
const IsAuthenticated = require("../../Middlewares/AuthMiddleware");

router.use(IsAuthenticated);

router.get("/dashboard", DashboardController.Dashboard);

module.exports = router;
