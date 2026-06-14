// =============================================
// CarbonTrack - Dashboard JavaScript
// File: js/dashboard.js
// Purpose: Fetch dashboard data from API,
//          populate stats, charts, and activity
// =============================================

const API_URL = "http://localhost:5000/api";

// =============================================
// CHECK AUTHENTICATION
// =============================================

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

// Redirect to login if not authenticated
if (!token || !user) {
    window.location.href = "login.html";
}

// =============================================
// SET USER NAME
// =============================================

document.getElementById("userName").textContent = user ? (user.fullName || "User") : "User";
document.getElementById("welcomeMessage").textContent =
    user ? `Welcome Back, ${user.fullName} 👋` : "Welcome Back 👋";

// =============================================
// LOGOUT
// =============================================

document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
});

// =============================================
// SAFE NUMBER FORMATTER
// =============================================

function safeFixed(val, decimals = 1) {
    const n = parseFloat(val);
    return isNaN(n) ? "0.0" : n.toFixed(decimals);
}

// =============================================
// FETCH DASHBOARD DATA
// =============================================

async function loadDashboard() {

    // Show loading placeholders
    document.getElementById("todayCarbon").textContent   = "...";
    document.getElementById("weeklyCarbon").textContent  = "...";
    document.getElementById("monthlyCarbon").textContent = "...";
    document.getElementById("carbonScore").textContent   = "...";

    try {

        const response = await fetch(`${API_URL}/dashboard`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        // Handle non-JSON or server errors gracefully
        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Invalid JSON from server");
        }

        if (data.success) {

            // Update stat cards (always safe - never crashes on null)
            document.getElementById("todayCarbon").textContent =
                `${safeFixed(data.todayCarbon)} kg`;

            document.getElementById("weeklyCarbon").textContent =
                `${safeFixed(data.weeklyCarbon)} kg`;

            document.getElementById("monthlyCarbon").textContent =
                `${safeFixed(data.monthlyCarbon)} kg`;

            document.getElementById("carbonScore").textContent =
                data.carbonScore || "A+";

            // Render charts
            renderWeeklyChart(data.weeklyData || []);
            renderPieChart(data.categoryData || {});

            // Render recent activity
            renderRecentActivity(data.recentEntries || []);

        } else {
            showDashboardError("Could not load dashboard data.");
        }

    } catch (error) {
        console.error("Dashboard Error:", error);
        showDashboardError("Server connection error. Please ensure the backend is running.");
    }

}

function showDashboardError(msg) {
    document.getElementById("todayCarbon").textContent   = "—";
    document.getElementById("weeklyCarbon").textContent  = "—";
    document.getElementById("monthlyCarbon").textContent = "—";
    document.getElementById("carbonScore").textContent   = "—";

    const tbody = document.getElementById("recentActivityBody");
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;color:#ef5350;padding:20px;">
                    <i class="fa-solid fa-circle-exclamation"></i> ${msg}
                </td>
            </tr>
        `;
    }
}

// =============================================
// WEEKLY LINE CHART
// =============================================

let weeklyChartInstance = null;

function renderWeeklyChart(weeklyData) {

    const ctx = document.getElementById("weeklyChart");
    if (!ctx) return;

    const labels = (weeklyData.length > 0)
        ? weeklyData.map(item => item.day || "")
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const values = (weeklyData.length > 0)
        ? weeklyData.map(item => parseFloat(item.total) || 0)
        : [0, 0, 0, 0, 0, 0, 0];

    if (weeklyChartInstance) {
        weeklyChartInstance.destroy();
    }

    weeklyChartInstance = new Chart(ctx, {

        type: "line",

        data: {
            labels: labels,
            datasets: [
                {
                    label: "Carbon (kg CO₂e)",
                    data: values,
                    borderColor: "#2E7D32",
                    backgroundColor: "rgba(46,125,50,.15)",
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#2E7D32",
                    pointRadius: 5
                }
            ]
        },

        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.parsed.y.toFixed(2)} kg CO₂e`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => `${v} kg` }
                }
            }
        }

    });

}

// =============================================
// PIE CHART
// =============================================

let pieChartInstance = null;

function renderPieChart(categoryData) {

    const ctx = document.getElementById("pieChart");
    if (!ctx) return;

    const values = [
        parseFloat(categoryData.transport)   || 0,
        parseFloat(categoryData.electricity) || 0,
        parseFloat(categoryData.food)        || 0,
        parseFloat(categoryData.waste)       || 0
    ];

    if (pieChartInstance) {
        pieChartInstance.destroy();
    }

    pieChartInstance = new Chart(ctx, {

        type: "doughnut",

        data: {
            labels: ["Transport", "Electricity", "Food", "Waste"],
            datasets: [
                {
                    data: values,
                    backgroundColor: ["#2E7D32", "#66BB6A", "#81C784", "#A5D6A7"],
                    hoverOffset: 8
                }
            ]
        },

        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.parsed.toFixed(2)} kg CO₂e`
                    }
                }
            }
        }

    });

}

// =============================================
// RECENT ACTIVITY TABLE
// =============================================

function renderRecentActivity(entries) {

    const tbody = document.getElementById("recentActivityBody");
    if (!tbody) return;

    if (!entries || entries.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;color:#607D8B;padding:20px;">
                    No activity yet. <a href="calculator.html" style="color:#2E7D32;">Start tracking!</a>
                </td>
            </tr>
        `;
        return;

    }

    const FACTORS = {
        transport: { car: 0.192, bus: 0.105, bike: 0.0, train: 0.041 },
        electricity: 0.85,
        food: 2.5
    };

    tbody.innerHTML = entries.map(entry => {

        const transportCarbon = (
            (parseFloat(entry.transport_car)   || 0) * FACTORS.transport.car +
            (parseFloat(entry.transport_bus)   || 0) * FACTORS.transport.bus +
            (parseFloat(entry.transport_bike)  || 0) * FACTORS.transport.bike +
            (parseFloat(entry.transport_train) || 0) * FACTORS.transport.train
        );
        const electricityCarbon = (parseFloat(entry.electricity) || 0) * FACTORS.electricity;
        const foodCarbon        = (parseFloat(entry.food)        || 0) * FACTORS.food;
        const totalCarbon       = parseFloat(entry.total_carbon) || 0;

        // Safe date parsing
        let dateStr = "—";
        try {
            const d = new Date(entry.entry_date);
            dateStr = isNaN(d.getTime()) ? "—" : d.toISOString().split('T')[0];
        } catch {}

        return `
            <tr>
                <td>${dateStr}</td>
                <td>${transportCarbon.toFixed(2)} kg</td>
                <td>${electricityCarbon.toFixed(2)} kg</td>
                <td>${foodCarbon.toFixed(2)} kg</td>
                <td><strong>${totalCarbon.toFixed(2)} kg</strong></td>
            </tr>
        `;

    }).join("");

}

// =============================================
// LOAD DASHBOARD ON PAGE LOAD
// =============================================

loadDashboard();