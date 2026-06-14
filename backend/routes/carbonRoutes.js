// ============================================
// CarbonTrack - Carbon Routes
// File: routes/carbonRoutes.js
// ============================================

const express = require("express");

const { verifyToken } = require("../middleware/authMiddleware");
const {
    addEntry,
    getHistory,
    updateCarbonEntry,
    deleteCarbonEntry
} = require("../controllers/carbonController");

const router = express.Router();

// All routes are protected
router.use(verifyToken);

// Module 3: Calculator
router.post("/add", addEntry);

// Module 4: History
router.get("/history", getHistory);
router.put("/update/:id", updateCarbonEntry);
router.delete("/delete/:id", deleteCarbonEntry);

module.exports = router;
