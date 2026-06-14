// =============================================
// CarbonTrack - Auth Page JavaScript
// File: js/auth.js
// Purpose: Handle Register & Login forms
//          with validation and API integration
// =============================================

// Backend API URL
const API_URL = "http://localhost:5000/api/auth";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // SHOW / HIDE PASSWORD
    // ==========================

    const togglePassword = document.querySelectorAll(".toggle-password");

    togglePassword.forEach(icon => {

        icon.addEventListener("click", () => {

            const input = icon.previousElementSibling;

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");

            } else {

                input.type = "password";

                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");

            }

        });

    });

    // =============================================
    // REGISTER FORM HANDLING
    // =============================================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        // Select Elements
        const fullname = document.getElementById("fullname");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");
        const terms = document.getElementById("terms");

        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");
        const confirmPasswordError = document.getElementById("confirmPasswordError");

        // =============================================
        // FULL NAME VALIDATION
        // =============================================

        fullname.addEventListener("input", validateName);

        function validateName() {

            const value = fullname.value.trim();

            if (value === "") {
                nameError.textContent = "Full name is required.";
                return false;
            }

            if (value.length < 3) {
                nameError.textContent = "Name must contain at least 3 characters.";
                return false;
            }

            nameError.textContent = "";
            return true;

        }

        // =============================================
        // EMAIL VALIDATION
        // =============================================

        email.addEventListener("input", validateEmail);

        function validateEmail() {

            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (email.value.trim() === "") {
                emailError.textContent = "Email is required.";
                return false;
            }

            if (!pattern.test(email.value.trim())) {
                emailError.textContent = "Enter a valid email address.";
                return false;
            }

            emailError.textContent = "";
            return true;

        }

        // =============================================
        // PASSWORD VALIDATION
        // =============================================

        password.addEventListener("input", validatePassword);

        function validatePassword() {

            const value = password.value;

            const uppercase = /[A-Z]/;
            const lowercase = /[a-z]/;
            const number = /[0-9]/;
            const special = /[@$!%*?&#]/;

            if (value.length < 8) {
                passwordError.textContent = "Password must be at least 8 characters.";
                return false;
            }

            if (!uppercase.test(value)) {
                passwordError.textContent = "Password must contain one uppercase letter.";
                return false;
            }

            if (!lowercase.test(value)) {
                passwordError.textContent = "Password must contain one lowercase letter.";
                return false;
            }

            if (!number.test(value)) {
                passwordError.textContent = "Password must contain one number.";
                return false;
            }

            if (!special.test(value)) {
                passwordError.textContent = "Password must contain one special character.";
                return false;
            }

            passwordError.textContent = "";

            validateConfirmPassword();

            return true;

        }

        // =============================================
        // CONFIRM PASSWORD
        // =============================================

        confirmPassword.addEventListener("input", validateConfirmPassword);

        function validateConfirmPassword() {

            if (confirmPassword.value === "") {
                confirmPasswordError.textContent = "Please confirm your password.";
                return false;
            }

            if (password.value !== confirmPassword.value) {
                confirmPasswordError.textContent = "Passwords do not match.";
                return false;
            }

            confirmPasswordError.textContent = "";
            return true;

        }

        // =============================================
        // REGISTER FORM SUBMIT
        // =============================================

        registerForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPasswordValid = validatePassword();
            const isConfirmValid = validateConfirmPassword();

            if (!terms.checked) {
                alert("Please accept the Terms & Conditions.");
                return;
            }

            if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid) {

                // Disable button during request
                const btn = document.getElementById("register-btn");
                btn.disabled = true;
                btn.textContent = "Creating Account...";

                try {

                    const response = await fetch(`${API_URL}/register`, {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            fullName: fullname.value.trim(),
                            email: email.value.trim(),
                            password: password.value
                        })

                    });

                    const data = await response.json();

                    if (data.success) {

                        alert("Registration Successful! Please login.");
                        window.location.href = "login.html";

                    } else {

                        alert(data.message || "Registration failed.");

                    }

                } catch (error) {

                    console.error("Register Error:", error);
                    alert("Server not responding. Please try again.");

                }

                // Re-enable button
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-leaf"></i> Create Account';

            }

        });

    }

    // =============================================
    // LOGIN FORM HANDLING
    // =============================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        const email = document.getElementById("email");
        const password = document.getElementById("password");

        const loginEmailError = document.getElementById("loginEmailError");
        const loginPasswordError = document.getElementById("loginPasswordError");

        // =============================================
        // LOGIN FORM SUBMIT
        // =============================================

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            let isValid = true;

            // Email validation
            if (email.value.trim() === "") {
                loginEmailError.textContent = "Email is required.";
                isValid = false;
            } else {
                loginEmailError.textContent = "";
            }

            // Password validation
            if (password.value === "") {
                loginPasswordError.textContent = "Password is required.";
                isValid = false;
            } else {
                loginPasswordError.textContent = "";
            }

            if (!isValid) return;

            // Disable button during request
            const btn = document.getElementById("login-btn");
            btn.disabled = true;
            btn.textContent = "Logging in...";

            try {

                const response = await fetch(`${API_URL}/login`, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email.value.trim(),
                        password: password.value
                    })

                });

                const data = await response.json();

                if (data.success) {

                    // Store token and user info in localStorage
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    // Redirect to dashboard
                    window.location.href = "dashboard.html";

                } else {

                    alert(data.message || "Login failed.");

                }

            } catch (error) {

                console.error("Login Error:", error);
                alert("Server not responding. Please try again.");

            }

            // Re-enable button
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';

        });

    }

});