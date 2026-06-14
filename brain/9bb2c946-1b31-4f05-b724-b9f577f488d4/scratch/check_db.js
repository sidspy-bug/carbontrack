require("dotenv").config({ path: "c:/Users/Siddhant saurav/OneDrive/Desktop/carbon footprint/backend/.env" });
const pool = require("c:/Users/Siddhant saurav/OneDrive/Desktop/carbon footprint/backend/config/db");

async function check() {
    try {
        const [tables] = await pool.execute("SHOW TABLES");
        console.log("Tables in database:", tables);
        process.exit(0);
    } catch (e) {
        console.error("Error checking database:", e);
        process.exit(1);
    }
}
check();
