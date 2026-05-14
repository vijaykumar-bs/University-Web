const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'university_db'
});

const events = [
    {
        title: 'Global Tech Symposium 2026',
        content: 'Join industry leaders and tech pioneers as they discuss the future of AI, Quantum Computing, and Sustainable Technology.',
        category: 'Campus News',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        is_upcoming: 1,
        event_date: '2026-10-15'
    },
    {
        title: 'Grand Alumni Reunion',
        content: 'Welcoming our global alumni back to campus for a night of nostalgia, networking, and celebrating achievements.',
        category: 'Announcements',
        image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
        is_upcoming: 1,
        event_date: '2026-11-02'
    },
    {
        title: 'International Yoga Festival',
        content: 'Celebrate the ancient wisdom of yoga with practitioners from around the globe. Workshops and meditation sessions.',
        category: 'Student Life',
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        is_upcoming: 1,
        event_date: '2026-11-18'
    }
];

db.connect(err => {
    if (err) throw err;
    console.log('Connected to seed events...');

    events.forEach(event => {
        const query = 'INSERT INTO posts (title, content, category, image_url, is_upcoming, event_date) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [event.title, event.content, event.category, event.image_url, event.is_upcoming, event.event_date], (err, res) => {
            if (err) console.error(err);
            else console.log('Inserted:', event.title);
        });
    });

    setTimeout(() => {
        db.end();
        process.exit();
    }, 2000);
});
