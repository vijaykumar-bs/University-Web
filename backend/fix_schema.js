const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'university_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database to fix schema...');

    const queries = [
        "ALTER TABLE posts ADD COLUMN is_upcoming BOOLEAN DEFAULT FALSE;",
        "ALTER TABLE posts ADD COLUMN event_date DATE;"
    ];

    let completed = 0;
    queries.forEach(query => {
        db.query(query, (err, res) => {
            if (err) {
                // If IF NOT EXISTS is not supported and it already exists, ignore
                if (err.code === 'ER_DUP_COLUMN_NAME') {
                    console.log('Column already exists, skipping...');
                } else {
                    console.error('Error executing query:', query, err);
                }
            } else {
                console.log('Successfully executed:', query);
            }
            completed++;
            if (completed === queries.length) {
                console.log('Schema fix complete.');
                db.end();
                process.exit();
            }
        });
    });
});
