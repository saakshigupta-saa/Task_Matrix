
const express = require("express");

const {
  createActivity,
  getActivities,
} = require("../controllers/activityController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createActivity);
router.get("/", protect, getActivities);

module.exports = router;

