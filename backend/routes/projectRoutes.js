const express = require("express");

const {
  createProject,
  getProjects,
  addProjectMember,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create project
router.post("/", protect, createProject);

// Get user's projects
router.get("/", protect, getProjects);

// Add a team member to a project
router.post("/:id/members", protect, addProjectMember);

// Update project
router.put("/:id", protect, updateProject);

// Delete project
router.delete("/:id", protect, deleteProject);

module.exports = router;
