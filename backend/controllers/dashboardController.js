// ============================================
// CarbonTrack - Dashboard Controller
// File: controllers/dashboardController.js
// Purpose: Provide stats and data for the dashboard
// ============================================

const {
    getCarbonSumByDateRange,
    getRecentEntries,
    getCategoryTotals
} = require("../models/carbonModel");

// Helper to get formatted date string YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

async function getDashboardStats(req, res) {

    try {

        const userId = req.user.id;
        const today = new Date();

        // Today's Date Range
        const todayStr = formatDate(today);

        // Weekly Date Range (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 6);
        const weekAgoStr = formatDate(weekAgo);

        // Monthly Date Range (1st of current month to today)
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstOfMonthStr = formatDate(firstOfMonth);

        // Fetch Totals
        const todayCarbon = parseFloat(await getCarbonSumByDateRange(userId, todayStr, todayStr)) || 0;
        const weeklyCarbon = parseFloat(await getCarbonSumByDateRange(userId, weekAgoStr, todayStr)) || 0;
        const monthlyCarbon = parseFloat(await getCarbonSumByDateRange(userId, firstOfMonthStr, todayStr)) || 0;

        // Calculate Carbon Score (Simple logic based on weekly carbon)
        let carbonScore = "A+";
        if (weeklyCarbon > 200) carbonScore = "F";
        else if (weeklyCarbon > 150) carbonScore = "D";
        else if (weeklyCarbon > 100) carbonScore = "C";
        else if (weeklyCarbon > 50) carbonScore = "B";
        else if (weeklyCarbon > 25) carbonScore = "A";

        // Fetch Recent Entries
        const recentEntries = await getRecentEntries(userId, 5);

        // Fetch Category Data for Pie Chart (Current Month)
        const categoryData = await getCategoryTotals(userId, firstOfMonthStr, todayStr);
        const categoryTotals = {
            transport: parseFloat(categoryData?.transport) || 0,
            electricity: parseFloat(categoryData?.electricity) || 0,
            food: parseFloat(categoryData?.food) || 0,
            waste: parseFloat(categoryData?.waste) || 0
        };

        // Generate Weekly Data for Line Chart (last 7 days individually)
        const weeklyData = [];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dStr = formatDate(d);
            const dailyTotal = parseFloat(await getCarbonSumByDateRange(userId, dStr, dStr)) || 0;
            weeklyData.push({
                day: days[d.getDay()],
                total: dailyTotal
            });
        }

        return res.status(200).json({
            success: true,
            todayCarbon,
            weeklyCarbon,
            monthlyCarbon,
            carbonScore,
            categoryData: categoryTotals,
            weeklyData,
            recentEntries
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error loading dashboard data"
        });
    }

}

module.exports = {
    getDashboardStats
};
