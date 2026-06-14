// ============================================
// CarbonTrack - Report Model
// File: models/reportModel.js
// ============================================

const db = require("../config/db");

// Re-using queries that group data by category and date range

async function getAggregatedCarbon(userId, startDate, endDate) {
    const [rows] = await db.execute(
        `SELECT 
            SUM(transport_car * 0.192 + transport_bus * 0.105 + transport_bike * 0.0 + transport_train * 0.041) as transport,
            SUM(electricity * 0.85) as electricity,
            SUM(food * 2.5) as food,
            SUM(waste * 0.5) as waste,
            SUM(total_carbon) as total
         FROM carbon_entries
         WHERE user_id = ? AND entry_date >= ? AND entry_date <= ?`,
        [userId, startDate, endDate]
    );

    return rows[0];
}

async function getDailyCarbon(userId, startDate, endDate) {
    const [rows] = await db.execute(
        `SELECT entry_date, SUM(total_carbon) as total
         FROM carbon_entries
         WHERE user_id = ? AND entry_date >= ? AND entry_date <= ?
         GROUP BY entry_date
         ORDER BY entry_date ASC`,
        [userId, startDate, endDate]
    );

    return rows;
}

module.exports = {
    getAggregatedCarbon,
    getDailyCarbon
};
