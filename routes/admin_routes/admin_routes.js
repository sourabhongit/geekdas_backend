const express = require("express");
const router = express.Router();
const dashboard_controller = require("../../controller/admin/dashboard_controller");
const { is_authenticated, redirect_if_authenticated } = require("../../middlewares/auth_middleware");

// router.use(IsAuthenticated);

// Route prefix "/admin"
router.get("/dashboard", is_authenticated, dashboard_controller.dashboard);

module.exports = router;
