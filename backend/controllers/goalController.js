// ============================================
// CarbonTrack - Goal Controller
// File: controllers/goalController.js
// ============================================

const {
    createGoal,
    getGoalsByUser,
    updateGoal,
    deleteGoal
} = require("../models/goalModel");

const { getCarbonSumByDateRange } = require("../models/carbonModel");

const { validateGoalInput } = require("../utils/validation");

async function addGoal(req, res) {
    try {
        const userId = req.user.id;
        const { title, targetCarbon } = req.body;

        // Validation
        const validationError = validateGoalInput(title, targetCarbon);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        await createGoal(userId, title, targetCarbon);
        return res.status(201).json({ success: true, message: "Goal added successfully" });
    } catch (error) {
        console.error("Add Goal Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

async function getGoals(req, res) {
    try {
        const userId = req.user.id;
        const goals = await getGoalsByUser(userId);

        // Calculate progress (We'll use current month's carbon as progress)
        const today = new Date();
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const currentCarbon = await getCarbonSumByDateRange(
            userId,
            firstOfMonth.toISOString().split('T')[0],
            today.toISOString().split('T')[0]
        );

        // Attach progress to each goal
        const goalsWithProgress = goals.map(goal => ({
            ...goal,
            current_carbon: currentCarbon
        }));

        return res.status(200).json({ success: true, goals: goalsWithProgress });
    } catch (error) {
        console.error("Get Goals Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

async function updateGoalStatus(req, res) {
    try {
        const userId = req.user.id;
        const goalId = req.params.id;
        const { status } = req.body;

        await updateGoal(goalId, userId, status);
        return res.status(200).json({ success: true, message: "Goal updated successfully" });
    } catch (error) {
        console.error("Update Goal Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

async function deleteUserGoal(req, res) {
    try {
        const userId = req.user.id;
        const goalId = req.params.id;

        await deleteGoal(goalId, userId);
        return res.status(200).json({ success: true, message: "Goal deleted successfully" });
    } catch (error) {
        console.error("Delete Goal Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

module.exports = {
    addGoal,
    getGoals,
    updateGoalStatus,
    deleteUserGoal
};
