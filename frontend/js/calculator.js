// =============================================
// CarbonTrack - Calculator JavaScript
// File: js/calculator.js
// Purpose: Live preview + API submit for carbon entries
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

// Set User Info in Navbar
document.getElementById("userName").textContent = user ? (user.fullName || "User") : "User";

// Logout Handler
document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
});

// =============================================
// CARBON EMISSION FACTORS (must match backend)
// =============================================

const FACTORS = {
    transport: { car: 0.192, bus: 0.105, bike: 0.0, train: 0.041 },
    electricity: 0.85,
    food: 2.5,
    water: 0.001,
    waste: 0.5
};

// =============================================
// LIVE PREVIEW CALCULATION
// =============================================

function getVal(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function calculateLiveCarbon() {
    const cCar   = getVal("transportCar")   * FACTORS.transport.car;
    const cBus   = getVal("transportBus")   * FACTORS.transport.bus;
    const cBike  = getVal("transportBike")  * FACTORS.transport.bike;
    const cTrain = getVal("transportTrain") * FACTORS.transport.train;
    const cElec  = getVal("electricity")    * FACTORS.electricity;
    const cFood  = getVal("food")           * FACTORS.food;
    const cWater = getVal("water")          * FACTORS.water;
    const cWaste = getVal("waste")          * FACTORS.waste;
    return cCar + cBus + cBike + cTrain + cElec + cFood + cWater + cWaste;
}

function updatePreview() {
    const total = calculateLiveCarbon();
    const preview = document.getElementById("livePreview");
    if (preview) {
        preview.textContent = `${total.toFixed(2)} kg CO₂e`;
    }
}

// Attach live update listeners
const inputIds = [
    "transportCar", "transportBus", "transportBike", "transportTrain",
    "electricity", "water", "food", "waste"
];

inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updatePreview);
});

// Initialize preview on load
updatePreview();

// =============================================
// TOAST NOTIFICATION
// =============================================

function showToast(message, isError = false) {
    // Remove existing toast if any
    const existing = document.querySelector(".calc-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `calc-toast${isError ? " error" : ""}`;
    toast.innerHTML = `<i class="fa-solid fa-${isError ? "circle-xmark" : "circle-check"}"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = "opacity .4s";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// =============================================
// FORM HANDLING
// =============================================

const form = document.getElementById("calculatorForm");

// Set default date to today
const dateInput = document.getElementById("entryDate");
if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("calcSubmitBtn");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    // Gather data
    const data = {
        entryDate:      document.getElementById("entryDate").value,
        transportCar:   getVal("transportCar"),
        transportBus:   getVal("transportBus"),
        transportBike:  getVal("transportBike"),
        transportTrain: getVal("transportTrain"),
        electricity:    getVal("electricity"),
        food:           getVal("food"),
        water:          getVal("water"),
        waste:          getVal("waste")
    };

    try {
        const response = await fetch(`${API_URL}/carbon/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        // Handle non-JSON or bad response
        let result;
        try {
            result = await response.json();
        } catch {
            throw new Error("Invalid server response");
        }

        if (response.ok && result.success) {
            const total = parseFloat(result.totalCarbon) || calculateLiveCarbon();
            showToast(`✅ Saved! Total: ${total.toFixed(2)} kg CO₂e`);

            // Redirect to dashboard after 2s
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 2000);
        } else {
            showToast(result.message || "Failed to save entry.", true);
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Calculate &amp; Save';
        }

    } catch (error) {
        console.error("Calculator Error:", error);
        showToast("Could not reach server. Is the backend running?", true);
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Calculate &amp; Save';
    }

});
