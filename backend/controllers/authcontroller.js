// ============================================
// CarbonTrack - Auth Controller
// File: controllers/authController.js
// Purpose: Handle Register and Login logic
// ============================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    findUserByEmail,
    createUser
} = require("../models/userModel");

const { validateRegisterInput } = require("../utils/validation");

// ============================================
// REGISTER USER
// ============================================

async function register(req, res) {

    try {

        const {
            fullName,
            email,
            password
        } = req.body;

        // Validation
        const validationError = validateRegisterInput(fullName, email, password);
        if (validationError) {

            return res.status(400).json({
                success: false,
                message: validationError
            });

        }

        // Check existing user
        const existingUser = await findUserByEmail(email);

        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });

        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        await createUser(fullName, email, passwordHash);

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {

        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

}

// ============================================
// LOGIN USER
// ============================================

async function login(req, res) {

    try {

        const { email, password } = req.body;

        // Validation
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }

        // Find user by email
        const user = await findUserByEmail(email);

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        // Generate JWT Token
        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                fullName: user.full_name
            },

            process.env.JWT_SECRET,

            { expiresIn: "7d" }

        );

        return res.status(200).json({

            success: true,
            message: "Login successful",

            token: token,

            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email
            }

        });

    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

}

module.exports = {
    register,
    login
};