// ============================================
// CarbonTrack - Profile Model
// File: models/profileModel.js
// ============================================

const db = require("../config/db");

async function getUserById(userId) {
    const [rows] = await db.execute(
        `SELECT id, full_name, email, created_at FROM users WHERE id = ?`,
        [userId]
    );
    return rows[0];
}

async function updateUser(userId, fullName) {
    const [result] = await db.execute(
        `UPDATE users SET full_name = ? WHERE id = ?`,
        [fullName, userId]
    );
    return result;
}

async function updatePassword(userId, passwordHash) {
    const [result] = await db.execute(
        `UPDATE users SET password_hash = ? WHERE id = ?`,
        [passwordHash, userId]
    );
    return result;
}

async function getPasswordHash(userId) {
    const [rows] = await db.execute(
        `SELECT password_hash FROM users WHERE id = ?`,
        [userId]
    );
    if (rows.length === 0) return null;
    return rows[0].password_hash;
}

module.exports = {
    getUserById,
    updateUser,
    updatePassword,
    getPasswordHash
};
