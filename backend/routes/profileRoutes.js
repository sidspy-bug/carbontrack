// ============================================
// CarbonTrack - Profile Routes
// File: routes/profileRoutes.js
// ============================================

const express = require("express");

const { verifyToken } = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfileInfo,
    changePassword
} = require("../controllers/profileController");

const router = express.Router();

router.use(verifyToken);

router.get("/", getProfile);
router.put("/update", updateProfileInfo);
router.put("/password", changePassword);

module.exports = router;
