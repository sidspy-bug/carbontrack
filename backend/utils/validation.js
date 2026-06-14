// ============================================
// CarbonTrack - Input Validation Utility
// File: utils/validation.js
// Purpose: Implement backend validation for user registrations,
//          carbon entries, goals, and profile updates.
// ============================================

// Email Regex Pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password Regex Pattern:
// - At least 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

// Date Regex YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validateRegisterInput(fullName, email, password) {
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3) {
        return "Full name must be at least 3 characters.";
    }
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        return "Please enter a valid email address.";
    }
    if (!password || typeof password !== "string" || !PASSWORD_REGEX.test(password)) {
        return "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    return null; // indicates valid input
}

function validateCarbonEntryInput(data) {
    if (data.entryDate && !DATE_REGEX.test(data.entryDate)) {
        return "Entry date must be in YYYY-MM-DD format.";
    }

    const metrics = [
        "transportCar",
        "transportBus",
        "transportBike",
        "transportTrain",
        "electricity",
        "food",
        "water",
        "waste"
    ];

    for (const metric of metrics) {
        const value = data[metric];
        if (value !== undefined && value !== null && value !== "") {
            const parsed = parseFloat(value);
            if (isNaN(parsed) || parsed < 0) {
                return `${metric} must be a non-negative number.`;
            }
        }
    }
    return null;
}

function validateGoalInput(title, targetCarbon) {
    if (!title || typeof title !== "string" || title.trim().length < 3) {
        return "Goal title must be at least 3 characters.";
    }
    const parsedTarget = parseFloat(targetCarbon);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
        return "Target Carbon must be a positive number.";
    }
    return null;
}

function validateProfileUpdateInput(fullName) {
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3) {
        return "Full name must be at least 3 characters.";
    }
    return null;
}

module.exports = {
    validateRegisterInput,
    validateCarbonEntryInput,
    validateGoalInput,
    validateProfileUpdateInput,
    PASSWORD_REGEX
};
