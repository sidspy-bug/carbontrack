// ============================================
// CarbonTrack - Auth Middleware
// File: middleware/authMiddleware.js
// Purpose: Verify JWT token for protected routes
// ============================================

const jwt = require("jsonwebtoken");

// Verify Token Middleware

function verifyToken(req, res, next) {

    // Get Authorization header
    const authHeader = req.headers["authorization"];

    // Check if header exists
    if (!authHeader) {

        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });

    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            success: false,
            message: "Access denied. Invalid token format."
        });

    }

    try {

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request
        req.user = decoded;

        // Continue to next middleware
        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }

}

module.exports = { verifyToken };
