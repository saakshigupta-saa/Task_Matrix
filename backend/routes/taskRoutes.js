
const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a task
router.post("/", protect, createTask);

// Get all tasks
router.get("/", protect, getTasks);

// Get a single task
router.get("/:id", protect, getTaskById);

// Update a task
router.put("/:id", protect, updateTask);

// Delete a task
router.delete("/:id", protect, deleteTask);

module.exports = router;

