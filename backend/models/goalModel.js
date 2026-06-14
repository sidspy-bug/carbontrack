// ============================================
// CarbonTrack - Goal Model
// File: models/goalModel.js
// ============================================

const db = require("../config/db");

async function createGoal(userId, title, targetCarbon) {
    const [result] = await db.execute(
        `INSERT INTO goals (user_id, title, target_carbon) VALUES (?, ?, ?)`,
        [userId, title, targetCarbon]
    );
    return result;
}

async function getGoalsByUser(userId) {
    // Current carbon progress can be calculated dynamically or updated. 
    // For simplicity, we just fetch goals. The controller will calculate progress.
    const [rows] = await db.execute(
        `SELECT * FROM goals WHERE user_id = ? ORDER BY id DESC`,
        [userId]
    );
    return rows;
}

async function updateGoal(goalId, userId, status) {
    const [result] = await db.execute(
        `UPDATE goals SET status = ? WHERE id = ? AND user_id = ?`,
        [status, goalId, userId]
    );
    return result;
}

async function deleteGoal(goalId, userId) {
    const [result] = await db.execute(
        `DELETE FROM goals WHERE id = ? AND user_id = ?`,
        [goalId, userId]
    );
    return result;
}

module.exports = {
    createGoal,
    getGoalsByUser,
    updateGoal,
    deleteGoal
};
