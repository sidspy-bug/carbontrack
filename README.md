# 🌱 CarbonTrack – Carbon Footprint Tracking & Sustainability Management System

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express-success)
![MySQL](https://img.shields.io/badge/Database-MySQL-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![HTML5](https://img.shields.io/badge/HTML5-CSS3-orange)

## 📖 Overview

**CarbonTrack** is a full-stack web application developed to help users calculate, monitor, and reduce their carbon footprint. The application enables users to register, securely log in, calculate carbon emissions from everyday activities, track historical data, set sustainability goals, and visualize their environmental impact through an interactive dashboard.

This project was developed as an **Internship Capstone Project** aligned with the **United Nations Sustainable Development Goal (SDG) 13 – Climate Action**.

---

# 🌍 Sustainable Development Goal

**SDG 13 – Climate Action**

CarbonTrack encourages environmentally responsible behavior by increasing awareness of individual carbon emissions and promoting sustainable lifestyle choices.

---

# ✨ Key Features

### 👤 User Authentication

* User Registration
* Secure Login
* Password Hashing using bcrypt
* JWT Authentication
* Protected Dashboard

---

### 📊 Dashboard

* Personalized Welcome Screen
* Today's Carbon Emission
* Weekly Carbon Emission
* Monthly Carbon Emission
* Carbon Score
* Recent Activities
* Goal Progress
* Interactive Charts

---

### 🌱 Carbon Footprint Calculator

Calculate emissions based on:

* Transportation
* Electricity Consumption
* Food Habits
* Water Usage
* Waste Generation

Automatically calculates total carbon footprint.

---

### 📜 History

* View Previous Calculations
* Search Records
* Sort by Date
* Edit Entries
* Delete Entries

---

### 🎯 Goals

* Create Sustainability Goals
* Update Goals
* Delete Goals
* Track Progress

---

### 📄 Reports

* Weekly Report
* Monthly Report
* Yearly Report
* PDF Export (Future Enhancement)

---

### 👤 User Profile

* View Profile
* Edit Profile
* Change Password

---

# 🛠 Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript (ES6)
* Chart.js
* Font Awesome
* Google Fonts

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* dotenv
* mysql2

## Database

* MySQL

## Development Tools

* Visual Studio Code
* Git
* GitHub
* MySQL Workbench
* Postman

---

# 📁 Project Structure

```text
CarbonTrack
│
├── frontend
│   ├── css
│   ├── js
│   ├── images
│   ├── pages
│   └── index.html
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── package.json
│   ├── .env
│   └── server.js
│
├── database
│   └── carbontrack.sql
│
├── README.md
│
└── .gitignore
```

---

# 🗄 Database Schema

## Users

| Field         | Type         |
| ------------- | ------------ |
| id            | INT          |
| full_name     | VARCHAR(100) |
| email         | VARCHAR(100) |
| password_hash | VARCHAR(255) |
| created_at    | TIMESTAMP    |

---

## Carbon Entries

| Field        | Type      |
| ------------ | --------- |
| id           | INT       |
| user_id      | INT       |
| transport    | FLOAT     |
| electricity  | FLOAT     |
| food         | FLOAT     |
| water        | FLOAT     |
| waste        | FLOAT     |
| total_carbon | FLOAT     |
| created_at   | TIMESTAMP |

---

## Goals

| Field    | Type    |
| -------- | ------- |
| id       | INT     |
| user_id  | INT     |
| goal     | VARCHAR |
| target   | FLOAT   |
| deadline | DATE    |
| status   | VARCHAR |

---

## Reports

| Field        | Type      |
| ------------ | --------- |
| id           | INT       |
| user_id      | INT       |
| report_type  | VARCHAR   |
| generated_at | TIMESTAMP |

---

# 🔐 Authentication

CarbonTrack uses:

* JWT (JSON Web Token)
* bcrypt Password Hashing
* Protected Routes
* Environment Variables

---

# 🚀 Installation Guide

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/carbontrack.git
```

---

## 2. Navigate to Backend

```bash
cd backend
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=carbontrack

JWT_SECRET=your_secret_key
```

---

## 5. Create Database

Open MySQL Workbench and execute:

```sql
CREATE DATABASE carbontrack;
```

Import the SQL file if available.

---

## 6. Run Backend

```bash
npm run dev
```

or

```bash
npm start
```

---

## 7. Open Frontend

Launch the frontend using Live Server or any local web server.

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register User |
| POST   | /api/auth/login    | Login User    |

---

## Carbon

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | /api/carbon/add        |
| GET    | /api/carbon/history    |
| PUT    | /api/carbon/update/:id |
| DELETE | /api/carbon/delete/:id |

---

## Goals

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /api/goals/add        |
| GET    | /api/goals            |
| PUT    | /api/goals/update/:id |
| DELETE | /api/goals/delete/:id |

---

## Reports

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/reports/weekly  |
| GET    | /api/reports/monthly |
| GET    | /api/reports/yearly  |

---

# 📊 Project Workflow

```text
User
   │
   ▼
Authentication
   │
   ▼
Dashboard
   │
   ▼
Carbon Calculator
   │
   ▼
Database
   │
   ▼
History
   │
   ▼
Goals
   │
   ▼
Reports
```

---

# 🎯 Learning Outcomes

This project demonstrates practical knowledge of:

* HTML5
* CSS3
* JavaScript
* Node.js
* Express.js
* MySQL
* REST APIs
* JWT Authentication
* MVC Architecture
* CRUD Operations
* Database Design
* Git & GitHub

---

# 🔮 Future Enhancements

* Email Notifications
* Mobile Application
* AI-Based Sustainability Suggestions
* Carbon Emission Prediction
* Cloud Database Integration
* Enhanced Analytics Dashboard

---

# 👨‍💻 Author

**Siddhant Saurav H**

Internship Capstone Project

---

# 📄 License

This project is developed for educational and internship purposes.

---

# ⭐ Support

If you found this project useful:

* ⭐ Star the repository
* 🍴 Fork the project
* 💡 Share your feedback
* 🤝 Contribute improvements

---

## Thank You

*"Every small sustainable action contributes to a healthier planet. CarbonTrack empowers individuals to understand their environmental impact and make informed choices toward a greener future."*
