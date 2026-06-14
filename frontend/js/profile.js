// =============================================
// CarbonTrack - Profile JavaScript
// File: js/profile.js
// =============================================

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");
let user = JSON.parse(localStorage.getItem("user"));

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
// LOAD PROFILE
// =============================================

async function loadProfile() {
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        
        if (data.success) {
            const u = data.user;
            document.getElementById("displayFullName").textContent = u.full_name;
            document.getElementById("displayEmail").textContent = u.email;
            
            const joinDate = new Date(u.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            document.getElementById("displayJoinDate").textContent = `Joined: ${joinDate}`;

            // Pre-fill edit form
            document.getElementById("editFullName").value = u.full_name;
            
            // Update navbar in case name changed
            document.getElementById("userName").textContent = u.full_name;
            
            // Update local storage
            user.fullName = u.full_name;
            localStorage.setItem("user", JSON.stringify(user));

        } else {
            alert("Failed to load profile data.");
        }
    } catch (error) {
        console.error("Profile Error:", error);
        alert("Server error loading profile.");
    }
}

// =============================================
// UPDATE PROFILE
// =============================================

document.getElementById("updateProfileForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("saveProfileBtn");
    btn.disabled = true;
    btn.textContent = "Saving...";

    const fullName = document.getElementById("editFullName").value;

    try {
        const response = await fetch(`${API_URL}/profile/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ fullName })
        });

        const data = await response.json();

        if (data.success) {
            alert("Profile updated successfully!");
            loadProfile(); // Reload to reflect changes
        } else {
            alert(data.message || "Failed to update profile.");
        }
    } catch (error) {
        console.error("Update Error:", error);
        alert("Server error");
    }

    btn.disabled = false;
    btn.textContent = "Update Profile";
});

// =============================================
// CHANGE PASSWORD
// =============================================

document.getElementById("changePasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;

    if (newPassword !== confirmNewPassword) {
        return alert("New passwords do not match!");
    }

    const btn = document.getElementById("changePwdBtn");
    btn.disabled = true;
    btn.textContent = "Updating...";

    try {
        const response = await fetch(`${API_URL}/profile/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await response.json();

        if (data.success) {
            alert("Password changed successfully! Please login again.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Failed to change password.");
        }
    } catch (error) {
        console.error("Password Error:", error);
        alert("Server error");
    }

    btn.disabled = false;
    btn.textContent = "Change Password";
});

// Init
loadProfile();
