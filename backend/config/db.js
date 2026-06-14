// ============================================
// CarbonTrack - Database Configuration
// File: config/db.js
// ============================================

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Create MySQL Connection Pool

const pool = mysql.createPool({

    host: process.env.DB_HOST,

    port: process.env.DB_PORT,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,

    multipleStatements: true

});

// Test Database Connection

async function connectDatabase() {

    try {

        const connection = await pool.getConnection();

        console.log("✅ MySQL Connected Successfully");

        // Initialize database tables from schema.sql
        const schemaPath = path.join(__dirname, "../../database/schema.sql");
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, "utf8");
            await connection.query(schemaSql);
            console.log("✅ Database schema initialized successfully");
        } else {
            console.warn("⚠️ Warning: schema.sql not found at " + schemaPath);
        }

        connection.release();

    }

    catch (error) {

        console.error("❌ Database Connection/Initialization Failed");

        console.error(error.message);

        process.exit(1);

    }

}

// Connect Immediately

connectDatabase();

// Export Connection Pool

module.exports = pool;