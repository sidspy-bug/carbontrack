// ============================================
// CarbonTrack - Report Routes
// File: routes/reportRoutes.js
// ============================================

const express = require("express");

const { verifyToken } = require("../middleware/authMiddleware");
const {
    getWeeklyReport,
    getMonthlyReport,
    getYearlyReport
} = require("../controllers/reportController");

const router = express.Router();

router.use(verifyToken);

router.get("/weekly", getWeeklyReport);
router.get("/monthly", getMonthlyReport);
router.get("/yearly", getYearlyReport);

module.exports = router;
