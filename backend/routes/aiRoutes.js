const express = require("express");

const {
  generateTask,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate-task", protect, generateTask);

module.exports = router;