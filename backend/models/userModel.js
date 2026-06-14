const db = require("../config/db");

// Find user by email

async function findUserByEmail(email) {

    const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
}

// Create user

async function createUser(fullName, email, passwordHash) {

    const [result] = await db.execute(
        `INSERT INTO users
        (full_name, email, password_hash)
        VALUES (?, ?, ?)`,
        [fullName, email, passwordHash]
    );

    return result;
}

module.exports = {
    findUserByEmail,
    createUser
};