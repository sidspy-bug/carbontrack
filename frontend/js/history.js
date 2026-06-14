// =============================================
// CarbonTrack - History JavaScript
// File: js/history.js
// Purpose: Fetch, display, filter, and delete history
// =============================================

const API_URL = "http://localhost:5000/api";

// =============================================
// CHECK AUTHENTICATION
// =============================================

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

if (!token || !user) {
    window.location.href = "login.html";
}

document.getElementById("userName").textContent = user ? (user.fullName || "User") : "User";

document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
});

// =============================================
// CARBON FACTORS
// =============================================

const FACTORS = {
    transport: { car: 0.192, bus: 0.105, bike: 0.0, train: 0.041 },
    electricity: 0.85,
    food: 2.5
};

// =============================================
// SAFE HELPERS
// =============================================

function safeFixed(val, dec = 2) {
    const n = parseFloat(val);
    return isNaN(n) ? "0.00" : n.toFixed(dec);
}

function safeDate(raw) {
    try {
        const d = new Date(raw);
        if (isNaN(d.getTime())) return "—";
        return d.toISOString().split('T')[0];
    } catch {
        return "—";
    }
}

// =============================================
// GLOBAL STATE
// =============================================

let historyData = [];

// =============================================
// FETCH HISTORY
// =============================================

async function loadHistory() {

    const tbody = document.getElementById("historyBody");
    tbody.innerHTML = `
        <tr><td colspan="6" style="text-align:center;color:#607D8B;padding:20px;">
            <i class="fa-solid fa-spinner fa-spin"></i> Loading history...
        </td></tr>
    `;

    try {

        const response = await fetch(`${API_URL}/carbon/history`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Invalid server response");
        }

        if (data.success) {
            historyData = data.entries || [];
            renderHistoryTable(historyData);
        } else {
            tbody.innerHTML = `
                <tr><td colspan="6" style="text-align:center;color:#ef5350;padding:20px;">
                    Failed to load history. ${data.message || ""}
                </td></tr>
            `;
        }

    } catch (error) {
        console.error("History Error:", error);
        tbody.innerHTML = `
            <tr><td colspan="6" style="text-align:center;color:#ef5350;padding:20px;">
                <i class="fa-solid fa-circle-exclamation"></i>
                Server connection error. Is the backend running?
            </td></tr>
        `;
    }

}

// =============================================
// RENDER TABLE
// =============================================

function renderHistoryTable(entries) {

    const tbody = document.getElementById("historyBody");

    if (!entries || entries.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:#607D8B;padding:30px;">
                    No carbon entries found.
                    <a href="calculator.html" style="color:#2E7D32;font-weight:600;">
                        Add your first entry!
                    </a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = entries.map(entry => {

        const transport = (
            (parseFloat(entry.transport_car)   || 0) * FACTORS.transport.car  +
            (parseFloat(entry.transport_bus)   || 0) * FACTORS.transport.bus  +
            (parseFloat(entry.transport_bike)  || 0) * FACTORS.transport.bike +
            (parseFloat(entry.transport_train) || 0) * FACTORS.transport.train
        );
        const elec  = (parseFloat(entry.electricity) || 0) * FACTORS.electricity;
        const food  = (parseFloat(entry.food)        || 0) * FACTORS.food;
        const total = parseFloat(entry.total_carbon) || 0;

        return `
            <tr id="row-${entry.id}">
                <td>${safeDate(entry.entry_date)}</td>
                <td>${safeFixed(transport)} kg</td>
                <td>${safeFixed(elec)} kg</td>
                <td>${safeFixed(food)} kg</td>
                <td><strong>${safeFixed(total)} kg</strong></td>
                <td>
                    <button class="action-btn delete-btn" onclick="deleteEntry(${entry.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;

    }).join("");

}

// =============================================
// SEARCH FILTER
// =============================================

document.getElementById("searchInput").addEventListener("input", (e) => {

    const term = e.target.value.trim().toLowerCase();

    if (!term) {
        renderHistoryTable(historyData);
        return;
    }

    const filtered = historyData.filter(entry => {
        return safeDate(entry.entry_date).includes(term);
    });

    renderHistoryTable(filtered);

});

// =============================================
// DELETE ENTRY
// =============================================

window.deleteEntry = async function(id) {

    if (!confirm("Are you sure you want to delete this entry?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/carbon/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        let result;
        try {
            result = await response.json();
        } catch {
            throw new Error("Invalid server response");
        }

        if (result.success) {
            // Remove row from DOM instantly for UX
            const row = document.getElementById(`row-${id}`);
            if (row) row.remove();

            // Update local data
            historyData = historyData.filter(e => e.id !== id);

            if (historyData.length === 0) {
                renderHistoryTable([]);
            }
        } else {
            alert(result.message || "Failed to delete entry");
        }

    } catch (error) {
        console.error("Delete Error:", error);
        alert("Server error. Please try again.");
    }

};

// Initialize
loadHistory();
