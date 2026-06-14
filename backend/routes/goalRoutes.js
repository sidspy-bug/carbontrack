// ============================================
// CarbonTrack - Goal Routes
// File: routes/goalRoutes.js
// ============================================

const express = require("express");

const { verifyToken } = require("../middleware/authMiddleware");
const {
    addGoal,
    getGoals,
    updateGoalStatus,
    deleteUserGoal
} = require("../controllers/goalController");

const router = express.Router();

router.use(verifyToken);

router.post("/add", addGoal);
router.get("/", getGoals);
router.put("/update/:id", updateGoalStatus);
router.delete("/delete/:id", deleteUserGoal);

module.exports = router;
