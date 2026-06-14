-- ============================================
-- CarbonTrack - Database Schema
-- File: database/schema.sql
-- ============================================

-- Create Database

CREATE DATABASE IF NOT EXISTS carbontrack;

USE carbontrack;

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ============================================
-- CARBON ENTRIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS carbon_entries (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    transport_car FLOAT DEFAULT 0,

    transport_bus FLOAT DEFAULT 0,

    transport_bike FLOAT DEFAULT 0,

    transport_train FLOAT DEFAULT 0,

    electricity FLOAT DEFAULT 0,

    food FLOAT DEFAULT 0,

    water FLOAT DEFAULT 0,

    waste FLOAT DEFAULT 0,

    total_carbon FLOAT NOT NULL,

    entry_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);

-- ============================================
-- GOALS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS goals (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(200) NOT NULL,

    target_carbon FLOAT NOT NULL,

    current_carbon FLOAT DEFAULT 0,

    status ENUM('active', 'completed') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);
