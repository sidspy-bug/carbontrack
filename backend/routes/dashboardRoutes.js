// ============================================
// CarbonTrack - Dashboard Routes
// File: routes/dashboardRoutes.js
// ============================================

const express = require("express");

const { verifyToken } = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/dashboardController");

const router = express.Router();

// Protected Dashboard Route
router.get("/", verifyToken, getDashboardStats);

module.exports = router;
