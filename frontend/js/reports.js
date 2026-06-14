// =============================================
// CarbonTrack - Reports JavaScript
// File: js/reports.js
// =============================================

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
    window.location.href = "login.html";
}

document.getElementById("userName").textContent = user.fullName;

document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
});

// =============================================
// GLOBAL CHART INSTANCES
// =============================================
let timeChartInstance = null;
let categoryChartInstance = null;

// =============================================
// LOAD REPORT
// =============================================

async function loadReport(period) {
    try {
        const response = await fetch(`${API_URL}/reports/${period}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        
        if (data.success) {
            updateUI(data);
        } else {
            alert("Failed to load report data.");
        }
    } catch (error) {
        console.error("Reports Error:", error);
        alert("Server error loading reports.");
    }
}

// =============================================
// UPDATE UI
// =============================================

function updateUI(data) {
    
    // 1. Update Summary Cards
    const total = data.summary.total || 0;
    document.getElementById("totalCarbonVal").textContent = `${total.toFixed(1)} kg`;
    document.getElementById("dateRangeVal").textContent = `${data.startDate} to ${data.endDate}`;

    // Find Highest / Lowest Category
    const categories = {
        Transport: data.summary.transport || 0,
        Electricity: data.summary.electricity || 0,
        Food: data.summary.food || 0,
        Waste: data.summary.waste || 0
    };

    let highest = "None";
    let highestVal = 0;
    let lowest = "None";
    let lowestVal = Infinity;

    for (const [key, val] of Object.entries(categories)) {
        if (val > highestVal) { highestVal = val; highest = key; }
        if (val < lowestVal && val > 0) { lowestVal = val; lowest = key; }
    }

    if (lowestVal === Infinity) lowest = "None";

    document.getElementById("highestCategoryVal").textContent = highest;
    document.getElementById("lowestCategoryVal").textContent = lowest;

    // 2. Render Charts
    renderTimeChart(data.dailyData);
    renderCategoryChart(categories);

}

// =============================================
// RENDER CHARTS
// =============================================

function renderTimeChart(dailyData) {
    const ctx = document.getElementById("timeChart");

    const labels = dailyData.map(d => new Date(d.entry_date).toLocaleDateString());
    const values = dailyData.map(d => d.total);

    if (timeChartInstance) timeChartInstance.destroy();

    timeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length ? labels : ["No Data"],
            datasets: [{
                label: 'Carbon (kg)',
                data: values.length ? values : [0],
                backgroundColor: '#66BB6A',
                borderRadius: 5
            }]
        },
        options: { responsive: true }
    });
}

function renderCategoryChart(categories) {
    const ctx = document.getElementById("categoryChart");

    const values = [
        categories.Transport,
        categories.Electricity,
        categories.Food,
        categories.Waste
    ];

    if (categoryChartInstance) categoryChartInstance.destroy();

    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Transport", "Electricity", "Food", "Waste"],
            datasets: [{
                data: values,
                backgroundColor: ["#2E7D32", "#66BB6A", "#81C784", "#A5D6A7"]
            }]
        },
        options: { responsive: true }
    });
}

// =============================================
// TABS LOGIC
// =============================================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Active class toggle
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Load data
        const period = e.target.getAttribute('data-period');
        loadReport(period);
    });
});

// Init
loadReport('weekly');
