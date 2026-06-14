// ============================================
// CarbonTrack - Server Entry Point
// File: server.js
// ============================================

// Load Environment Variables First
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Database Connection
const db = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const carbonRoutes = require("./routes/carbonRoutes");
const goalRoutes = require("./routes/goalRoutes");
const reportRoutes = require("./routes/reportRoutes");
const profileRoutes = require("./routes/profileRoutes");

// ============================================
// APP INITIALIZATION
// ============================================

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());

// Security Headers Middleware
app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Content-Security-Policy", "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;");
    next();
});

// ============================================
// HOME ROUTE
// ============================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "🌿 CarbonTrack Backend Running Successfully"
    });

});

// ============================================
// API ROUTES
// ============================================

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/carbon", carbonRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/profile", profileRoutes);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});