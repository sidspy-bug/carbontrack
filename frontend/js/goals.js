// =============================================
// CarbonTrack - Goals JavaScript
// File: js/goals.js
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
// LOAD GOALS
// =============================================

async function loadGoals() {
    try {
        const response = await fetch(`${API_URL}/goals`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        
        if (data.success) {
            renderGoals(data.goals);
        } else {
            document.getElementById("goalsList").innerHTML = `<p style="color:red;text-align:center;">Failed to load goals.</p>`;
        }
    } catch (error) {
        console.error("Goals Error:", error);
        document.getElementById("goalsList").innerHTML = `<p style="color:red;text-align:center;">Server error loading goals.</p>`;
    }
}

// Helper to escape HTML tags and protect against stored XSS
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// =============================================
// RENDER GOALS
// =============================================

function renderGoals(goals) {
    const list = document.getElementById("goalsList");

    if (goals.length === 0) {
        list.innerHTML = `
            <div style="text-align:center;color:#607D8B;padding:30px;">
                No goals yet. Create one on the left!
            </div>
        `;
        return;
    }

    list.innerHTML = goals.map(goal => {
        const target = goal.target_carbon;
        const current = goal.current_carbon || 0;
        
        // Progress Calculation
        let percentage = (current / target) * 100;
        let isOver = false;
        
        if (percentage > 100) {
            percentage = 100;
            isOver = true;
        }

        const progressColorClass = isOver ? 'progress-fill over' : 'progress-fill';
        const statusClass = goal.status === 'completed' ? 'status-completed' : 'status-active';
        
        return `
            <div class="goal-item" id="goal-${goal.id}">
                <div class="goal-top">
                    <div class="goal-info">
                        <h4>${escapeHTML(goal.title)}</h4>
                        <p>Target: ${target.toFixed(1)} kg / month</p>
                    </div>
                    <span class="goal-status ${statusClass}">
                        ${goal.status.toUpperCase()}
                    </span>
                </div>

                <div class="progress-container">
                    <div class="${progressColorClass}" style="width: ${percentage}%;"></div>
                </div>

                <div class="goal-stats">
                    <span>Current: ${current.toFixed(1)} kg</span>
                    <span>${percentage.toFixed(0)}%</span>
                </div>

                <div class="goal-actions">
                    ${goal.status === 'active' ? `
                        <button class="btn-small btn-complete" onclick="updateGoalStatus(${goal.id}, 'completed')">
                            Mark Completed
                        </button>
                    ` : `
                        <button class="btn-small btn-complete" onclick="updateGoalStatus(${goal.id}, 'active')">
                            Mark Active
                        </button>
                    `}
                    <button class="btn-small btn-delete" onclick="deleteGoal(${goal.id})">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// =============================================
// ADD GOAL
// =============================================

document.getElementById("goalForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("addGoalBtn");
    btn.disabled = true;

    const title = document.getElementById("goalTitle").value;
    const targetCarbon = parseFloat(document.getElementById("targetCarbon").value);

    try {
        const response = await fetch(`${API_URL}/goals/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, targetCarbon })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById("goalForm").reset();
            loadGoals();
        } else {
            alert(data.message || "Failed to add goal");
        }
    } catch (error) {
        console.error("Add Goal Error:", error);
        alert("Server error");
    }

    btn.disabled = false;
});

// =============================================
// UPDATE STATUS
// =============================================

window.updateGoalStatus = async function(id, status) {
    try {
        const response = await fetch(`${API_URL}/goals/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (data.success) {
            loadGoals();
        } else {
            alert(data.message || "Failed to update goal");
        }
    } catch (error) {
        console.error("Update Goal Error:", error);
        alert("Server error");
    }
}

// =============================================
// DELETE GOAL
// =============================================

window.deleteGoal = async function(id) {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
        const response = await fetch(`${API_URL}/goals/delete/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            loadGoals();
        } else {
            alert(data.message || "Failed to delete goal");
        }
    } catch (error) {
        console.error("Delete Goal Error:", error);
        alert("Server error");
    }
}

// Init
loadGoals();
