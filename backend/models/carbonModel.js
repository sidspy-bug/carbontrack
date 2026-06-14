// ============================================
// CarbonTrack - Carbon Model
// File: models/carbonModel.js
// Purpose: Handle database queries for carbon entries
// ============================================

const db = require("../config/db");

// ============================================
// CREATE ENTRY
// ============================================

async function createEntry(userId, data) {

    const transportCar = parseFloat(data.transportCar) || 0;
    const transportBus = parseFloat(data.transportBus) || 0;
    const transportBike = parseFloat(data.transportBike) || 0;
    const transportTrain = parseFloat(data.transportTrain) || 0;
    const electricity = parseFloat(data.electricity) || 0;
    const food = parseFloat(data.food) || 0;
    const water = parseFloat(data.water) || 0;
    const waste = parseFloat(data.waste) || 0;
    const totalCarbon = parseFloat(data.totalCarbon) || 0;
    const entryDate = data.entryDate || new Date().toISOString().split('T')[0];

    const [result] = await db.execute(
        `INSERT INTO carbon_entries 
        (user_id, transport_car, transport_bus, transport_bike, transport_train, 
         electricity, food, water, waste, total_carbon, entry_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, transportCar, transportBus, transportBike, transportTrain, 
         electricity, food, water, waste, totalCarbon, entryDate]
    );

    return result;

}

// ============================================
// DASHBOARD QUERIES
// ============================================

async function getCarbonSumByDateRange(userId, startDate, endDate) {

    const [rows] = await db.execute(
        `SELECT SUM(total_carbon) as total 
         FROM carbon_entries 
         WHERE user_id = ? AND entry_date >= ? AND entry_date <= ?`,
        [userId, startDate, endDate]
    );

    return rows[0].total || 0;

}

async function getRecentEntries(userId, limit = 5) {

    const [rows] = await db.execute(
        `SELECT * FROM carbon_entries 
         WHERE user_id = ? 
         ORDER BY entry_date DESC, id DESC 
         LIMIT ?`,
        [userId, limit]
    );

    return rows;

}

async function getCategoryTotals(userId, startDate, endDate) {

    const [rows] = await db.execute(
        `SELECT 
            SUM(transport_car * 0.192 + transport_bus * 0.105 + transport_bike * 0.0 + transport_train * 0.041) as transport,
            SUM(electricity * 0.85) as electricity,
            SUM(food * 2.5) as food,
            SUM(waste * 0.5) as waste
         FROM carbon_entries
         WHERE user_id = ? AND entry_date >= ? AND entry_date <= ?`,
        [userId, startDate, endDate]
    );

    return rows[0];

}

// ============================================
// HISTORY QUERIES
// ============================================

async function getEntriesByUser(userId) {

    const [rows] = await db.execute(
        `SELECT * FROM carbon_entries 
         WHERE user_id = ? 
         ORDER BY entry_date DESC, id DESC`,
        [userId]
    );

    return rows;

}

async function updateEntry(entryId, userId, data) {

    const transportCar = parseFloat(data.transportCar) || 0;
    const transportBus = parseFloat(data.transportBus) || 0;
    const transportBike = parseFloat(data.transportBike) || 0;
    const transportTrain = parseFloat(data.transportTrain) || 0;
    const electricity = parseFloat(data.electricity) || 0;
    const food = parseFloat(data.food) || 0;
    const water = parseFloat(data.water) || 0;
    const waste = parseFloat(data.waste) || 0;
    const totalCarbon = parseFloat(data.totalCarbon) || 0;
    const entryDate = data.entryDate || new Date().toISOString().split('T')[0];

    const [result] = await db.execute(
        `UPDATE carbon_entries SET
            transport_car = ?, transport_bus = ?, transport_bike = ?, transport_train = ?,
            electricity = ?, food = ?, water = ?, waste = ?, total_carbon = ?, entry_date = ?
         WHERE id = ? AND user_id = ?`,
        [transportCar, transportBus, transportBike, transportTrain, 
         electricity, food, water, waste, totalCarbon, entryDate, entryId, userId]
    );

    return result;

}

async function deleteEntry(entryId, userId) {

    const [result] = await db.execute(
        `DELETE FROM carbon_entries WHERE id = ? AND user_id = ?`,
        [entryId, userId]
    );

    return result;

}

module.exports = {
    createEntry,
    getCarbonSumByDateRange,
    getRecentEntries,
    getCategoryTotals,
    getEntriesByUser,
    updateEntry,
    deleteEntry
};
