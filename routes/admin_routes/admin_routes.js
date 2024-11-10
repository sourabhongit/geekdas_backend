const express = require("express");
const router = express.Router();
const dashboard_controller = require("../../controller/admin/dashboard_controller");
const skill_controller = require("../../controller/admin/skill_controller");
const project_controller = require("../../controller/admin/project_controller");
const { is_authenticated, redirect_if_authenticated } = require("../../middlewares/auth_middleware");

// Route prefix "/admin"
router.get("/dashboard", is_authenticated, dashboard_controller.dashboard);

// Skill routes
router.get("/skills", is_authenticated, skill_controller.skill_index);
router.get("/skill/create", is_authenticated, skill_controller.skill_create);
router.post("/skill/store", is_authenticated, skill_controller.skill_store);

// Project routes
router.get("/projects", is_authenticated, project_controller.project_index);
router.get("/project/create", is_authenticated, project_controller.project_create);
router.post("/project/store", is_authenticated, project_controller.project_store);

module.exports = router;
