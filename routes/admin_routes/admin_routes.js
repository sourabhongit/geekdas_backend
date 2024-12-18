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
router.get("/skill/edit/:id", is_authenticated, skill_controller.skill_edit);
router.post("/skill/update", is_authenticated, skill_controller.skill_update);
router.get("/skill/delete/:id", is_authenticated, skill_controller.skill_delete);

// Project routes
router.get("/projects", is_authenticated, project_controller.project_index);
router.get("/project/create", is_authenticated, project_controller.project_create);
router.post("/project/store", is_authenticated, project_controller.project_store);
router.get("/project/edit/:id", is_authenticated, project_controller.project_edit);
router.post("/project/update", is_authenticated, project_controller.project_update);

module.exports = router;
