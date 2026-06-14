// ============================================
// CarbonTrack - Report Controller
// File: controllers/reportController.js
// ============================================

const { getAggregatedCarbon, getDailyCarbon } = require("../models/reportModel");

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatReportData(summary, dailyData) {
    return {
        summary: {
            transport: parseFloat(summary?.transport) || 0,
            electricity: parseFloat(summary?.electricity) || 0,
            food: parseFloat(summary?.food) || 0,
            waste: parseFloat(summary?.waste) || 0,
            total: parseFloat(summary?.total) || 0
        },
        dailyData: (dailyData || []).map(d => ({
            entry_date: d.entry_date,
            total: parseFloat(d.total) || 0
        }))
    };
}

async function getWeeklyReport(req, res) {
    try {
        const userId = req.user.id;
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 6);

        const startDate = formatDate(weekAgo);
        const endDate = formatDate(today);

        const rawSummary = await getAggregatedCarbon(userId, startDate, endDate);
        const rawDailyData = await getDailyCarbon(userId, startDate, endDate);

        const { summary, dailyData } = formatReportData(rawSummary, rawDailyData);

        return res.status(200).json({ success: true, summary, dailyData, startDate, endDate });
    } catch (error) {
        console.error("Weekly Report Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

async function getMonthlyReport(req, res) {
    try {
        const userId = req.user.id;
        const today = new Date();
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const startDate = formatDate(firstOfMonth);
        const endDate = formatDate(today);

        const rawSummary = await getAggregatedCarbon(userId, startDate, endDate);
        const rawDailyData = await getDailyCarbon(userId, startDate, endDate);

        const { summary, dailyData } = formatReportData(rawSummary, rawDailyData);

        return res.status(200).json({ success: true, summary, dailyData, startDate, endDate });
    } catch (error) {
        console.error("Monthly Report Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

async function getYearlyReport(req, res) {
    try {
        const userId = req.user.id;
        const today = new Date();
        const firstOfYear = new Date(today.getFullYear(), 0, 1);

        const startDate = formatDate(firstOfYear);
        const endDate = formatDate(today);

        const rawSummary = await getAggregatedCarbon(userId, startDate, endDate);
        const rawDailyData = await getDailyCarbon(userId, startDate, endDate);

        const { summary, dailyData } = formatReportData(rawSummary, rawDailyData);

        return res.status(200).json({ success: true, summary, dailyData, startDate, endDate });
    } catch (error) {
        console.error("Yearly Report Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

module.exports = {
    getWeeklyReport,
    getMonthlyReport,
    getYearlyReport
};
