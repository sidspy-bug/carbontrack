// ============================================
// CarbonTrack - Profile Controller
// File: controllers/profileController.js
// ============================================

const bcrypt = require("bcryptjs");
const { getUserById, updateUser, updatePassword, getPasswordHash } = require("../models/profileModel");

const { validateProfileUpdateInput, PASSWORD_REGEX } = require("../utils/validation");

async function getProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

async function updateProfileInfo(req, res) {
    try {
        const userId = req.user.id;
        const { fullName } = req.body;

        // Validation
        const validationError = validateProfileUpdateInput(fullName);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        await updateUser(userId, fullName);

        return res.status(200).json({ success: true, message: "Profile updated successfully", fullName });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

async function changePassword(req, res) {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Both current and new password are required" });
        }

        // Validate password complexity
        if (!PASSWORD_REGEX.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }

        // Verify current password
        const hash = await getPasswordHash(userId);
        const isMatch = await bcrypt.compare(currentPassword, hash);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password" });
        }

        // Hash new password
        const newHash = await bcrypt.hash(newPassword, 10);
        await updatePassword(userId, newHash);

        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

module.exports = {
    getProfile,
    updateProfileInfo,
    changePassword
};
