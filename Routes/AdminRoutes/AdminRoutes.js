const express = require("express");
const router = express.Router();
const DashboardController = require("../../Controller/Admin/DashboardController");
const { IsAuthenticated, RedirectIfAuthenticated } = require("../../Middlewares/AuthMiddleware");

// router.use(IsAuthenticated);

// Route prefix "/admin"
router.get("/dashboard", IsAuthenticated, DashboardController.Dashboard);
// router.get("/dashboard", DashboardController.Dashboard);

module.exports = router;
