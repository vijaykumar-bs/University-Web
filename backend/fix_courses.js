const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function run() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
    try {
        await conn.query("ALTER TABLE courses ADD COLUMN category ENUM('UG', 'PG', 'PhD', 'Diploma') DEFAULT 'UG' AFTER department;");
        console.log('Category column added.');
        // Update some courses to PG for testing
        await conn.query("UPDATE courses SET category = 'PG' WHERE name LIKE '%Master%' OR name LIKE '%M.%' OR name LIKE '%MBA%';");
        console.log('Courses categorized.');
    } catch (e) {
        console.error(e.message);
    } finally {
        await conn.end();
    }
}
run();
