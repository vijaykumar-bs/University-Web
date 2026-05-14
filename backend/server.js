const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../'))); // Serve root files like index.html

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL server.');

    // Create database and switch to it
    db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
        if (err) console.error('Error creating database:', err);
        
        db.changeUser({ database: process.env.DB_NAME }, (err) => {
            if (err) console.error('Error switching database:', err);
            initializeTables();
        });
    });
});

function initializeTables() {
    // Create tables if they don't exist
    const schema = `
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
        CREATE TABLE IF NOT EXISTS applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            father_name VARCHAR(100),
            mother_name VARCHAR(100),
            dob DATE,
            gender VARCHAR(20),
            blood_group VARCHAR(10),
            email VARCHAR(100),
            phone VARCHAR(20),
            course VARCHAR(100),
            previous_qualification VARCHAR(255),
            school VARCHAR(255),
            photo_path VARCHAR(255),
            marksheet_path VARCHAR(255),
            status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            category VARCHAR(50),
            image_url VARCHAR(255),
            is_upcoming BOOLEAN DEFAULT FALSE,
            event_date DATE,
            view_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS faculties (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            designation VARCHAR(100),
            department VARCHAR(100),
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            department VARCHAR(100),
            duration VARCHAR(50),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_name VARCHAR(100),
            rating INT,
            comment TEXT,
            status ENUM('Pending', 'Approved') DEFAULT 'Pending',
            sentiment_score INT DEFAULT 0,
            sentiment_label VARCHAR(20) DEFAULT 'Neutral',
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS enquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100),
            phone VARCHAR(20),
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS placement_stories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_name VARCHAR(100),
            course VARCHAR(100),
            company VARCHAR(100),
            package VARCHAR(20),
            story TEXT,
            image_url VARCHAR(255),
            status ENUM('Pending', 'Approved') DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    
    // Execute schema (split by semicolon)
    schema.split(';').filter(q => q.trim()).forEach(query => {
        db.query(query, (err) => {
            if (err) console.error('Error creating table:', err);
        });
    });

    // Create default admin if not exists
    db.query('SELECT * FROM admins WHERE username = "vijay"', (err, results) => {
        if (err) return console.error('Error checking admin:', err);
        if (results && results.length === 0) {
            const hashedPassword = bcrypt.hashSync('2002', 10);
            db.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['vijay', hashedPassword]);
            console.log('Default admin created: vijay / 2002');
        }
    });


    // AI Schema Update: Add sentiment columns if they don't exist
    db.query("SHOW COLUMNS FROM reviews LIKE 'sentiment_score'", (err, results) => {
        if (!err && results.length === 0) {
            db.query("ALTER TABLE reviews ADD COLUMN sentiment_score INT DEFAULT 0, ADD COLUMN sentiment_label VARCHAR(20) DEFAULT 'Neutral'");
            console.log('AI Sentiment columns added to reviews table.');
        }
        
        // One-time Migration: Analyze reviews that haven't been processed yet
        db.query("SELECT * FROM reviews WHERE sentiment_label = 'Neutral' AND sentiment_score = 0", (err, results) => {
            if (!err && results && results.length > 0) {
                console.log(`AI is now analyzing ${results.length} existing reviews...`);
                results.forEach(review => {
                    const analysis = sentiment.analyze(review.comment || "");
                    const score = analysis.score;
                    const label = score > 0 ? 'Positive' : (score < 0 ? 'Negative' : 'Neutral');
                    
                    // Auto-approve existing high quality reviews
                    let statusUpdate = "";
                    if (review.rating > 3 && score >= 2) {
                        statusUpdate = ", status = 'Approved'";
                    }
                    
                    db.query(`UPDATE reviews SET sentiment_score = ?, sentiment_label = ? ${statusUpdate} WHERE id = ?`, [score, label, review.id]);
                });
                console.log('AI analysis of existing reviews complete!');
            }
        });
    });
}


// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'photo') cb(null, 'uploads/photos/');
        else if (file.fieldname === 'marksheet') cb(null, 'uploads/marksheets/');
        else if (file.fieldname === 'story_image') cb(null, 'uploads/stories/');
        else if (file.fieldname === 'review_image') cb(null, 'uploads/reviews/');
        else cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- AUTH ROUTES ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const admin = results[0];
        if (bcrypt.compareSync(password, admin.password)) {
            const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '8h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Malformed token' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Session expired. Please log in again.' });
            }
            return res.status(401).json({ message: 'Invalid token.' });
        }
        req.adminId = decoded.id;
        next();
    });
};

// --- APPLICATION ROUTES ---
app.post('/api/applications', upload.fields([{ name: 'photo' }, { name: 'marksheet' }]), (req, res) => {
    const data = req.body;
    const photo_path = req.files['photo'] ? req.files['photo'][0].path : null;
    const marksheet_path = req.files['marksheet'] ? req.files['marksheet'][0].path : null;

    const query = `INSERT INTO applications 
        (first_name, last_name, father_name, mother_name, dob, gender, blood_group, email, phone, course, previous_qualification, school, photo_path, marksheet_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
        data.first_name, data.last_name, data.father_name, data.mother_name, data.dob, 
        data.gender, data.blood_group, data.email, data.phone, data.course, 
        data.previous_qualification, data.school, photo_path, marksheet_path
    ];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Application submitted successfully', id: result.insertId });
    });
});

app.get('/api/applications', verifyToken, (req, res) => {
    db.query('SELECT * FROM applications ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.put('/api/applications/:id', verifyToken, (req, res) => {
    const { status } = req.body;
    db.query('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Status updated' });
    });
});

// --- ENQUIRY ROUTES ---
app.get('/api/enquiries', verifyToken, (req, res) => {
    db.query('SELECT * FROM enquiries ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/enquiries', (req, res) => {
    const { name, email, phone, message } = req.body;
    db.query('INSERT INTO enquiries (name, email, phone, message) VALUES (?, ?, ?, ?)', 
    [name, email, phone, message], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Enquiry sent', id: result.insertId });
    });
});

app.delete('/api/enquiries/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM enquiries WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Enquiry deleted' });
    });
});


// --- POST/BLOG ROUTES ---
app.get('/api/posts', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    let query = 'SELECT * FROM posts';
    let params = [];
    
    if (req.query.is_upcoming === '1') {
        query += ' WHERE is_upcoming = TRUE';
    }
    
    query += ' ORDER BY event_date ASC, created_at DESC';
    
    if (req.query.limit) {
        query += ' LIMIT ?';
        params.push(parseInt(req.query.limit));
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/posts/:id', (req, res) => {
    // Increment view count
    db.query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [req.params.id]);
    
    db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Post not found' });
        res.json(results[0]);
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    const { title, content, category, image_url, is_upcoming, event_date } = req.body;
    db.query('INSERT INTO posts (title, content, category, image_url, is_upcoming, event_date) VALUES (?, ?, ?, ?, ?, ?)', 
    [title, content, category, image_url, is_upcoming, event_date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Post created', id: result.insertId });
    });
});

app.put('/api/posts/:id', verifyToken, (req, res) => {
    const { title, content, category, image_url, is_upcoming, event_date } = req.body;
    db.query('UPDATE posts SET title = ?, content = ?, category = ?, image_url = ?, is_upcoming = ?, event_date = ? WHERE id = ?', 
    [title, content, category, image_url, is_upcoming, event_date, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Post updated' });
    });
});

app.delete('/api/posts/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM posts WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Post deleted' });
    });
});

// --- FACULTY ROUTES ---
app.get('/api/faculties', (req, res) => {
    db.query('SELECT * FROM faculties ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/faculties', verifyToken, (req, res) => {
    const { name, designation, department, image_url } = req.body;
    db.query('INSERT INTO faculties (name, designation, department, image_url) VALUES (?, ?, ?, ?)', 
    [name, designation, department, image_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Faculty added', id: result.insertId });
    });
});

app.put('/api/faculties/:id', verifyToken, (req, res) => {
    const { name, designation, department, image_url } = req.body;
    db.query('UPDATE faculties SET name = ?, designation = ?, department = ?, image_url = ? WHERE id = ?', 
    [name, designation, department, image_url, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Faculty updated' });
    });
});

app.delete('/api/faculties/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM faculties WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Faculty deleted' });
    });
});

// --- COURSE ROUTES ---
app.get('/api/courses', (req, res) => {
    db.query('SELECT * FROM courses ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/courses', verifyToken, (req, res) => {
    const { name, department, duration, description } = req.body;
    db.query('INSERT INTO courses (name, department, duration, description) VALUES (?, ?, ?, ?)', 
    [name, department, duration, description], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Course added', id: result.insertId });
    });
});

app.put('/api/courses/:id', verifyToken, (req, res) => {
    const { name, department, duration, description } = req.body;
    db.query('UPDATE courses SET name = ?, department = ?, duration = ?, description = ? WHERE id = ?', 
    [name, department, duration, description, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Course updated' });
    });
});

app.delete('/api/courses/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM courses WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Course deleted' });
    });
});

// --- REVIEW ROUTES ---
app.get('/api/reviews', (req, res) => {
    // Only fetch approved reviews for public view, or all for admin
    const query = req.query.all === 'true' ? 'SELECT * FROM reviews ORDER BY created_at DESC' : 'SELECT * FROM reviews WHERE status = "Approved" ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/reviews', upload.single('review_image'), (req, res) => {
    const { student_name, rating, comment } = req.body;
    const image_url = req.file ? `/uploads/reviews/${req.file.filename}` : null;
    
    // AI Sentiment Analysis
    const result = sentiment.analyze(comment);
    const sentiment_score = result.score;
    const sentiment_label = sentiment_score > 0 ? 'Positive' : (sentiment_score < 0 ? 'Negative' : 'Neutral');

    // Auto-Approval Logic: Approve if Rating > 3 AND Sentiment Score is positive (proper words)
    let status = 'Pending';
    if (parseInt(rating) > 3 && sentiment_score >= 2) {
        status = 'Approved';
    }

    db.query('INSERT INTO reviews (student_name, rating, comment, image_url, sentiment_score, sentiment_label, status) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [student_name, rating, comment, image_url, sentiment_score, sentiment_label, status], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            message: status === 'Approved' ? 'Review auto-approved by AI' : 'Review submitted for approval', 
            id: result.insertId,
            ai_sentiment: sentiment_label,
            auto_approved: status === 'Approved'
        });
    });
});

app.put('/api/reviews/:id', verifyToken, (req, res) => {
    const { status } = req.body;
    db.query('UPDATE reviews SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Review status updated' });
    });
});

app.delete('/api/reviews/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM reviews WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Review deleted' });
    });
});


// --- PLACEMENT STORY ROUTES ---
app.get('/api/placement-stories', (req, res) => {
    const query = req.query.all === 'true' ? 'SELECT * FROM placement_stories ORDER BY created_at DESC' : 'SELECT * FROM placement_stories WHERE status = "Approved" ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/placement-stories', upload.single('story_image'), (req, res) => {
    const { student_name, course, company, package, story } = req.body;
    const image_url = req.file ? `/uploads/stories/${req.file.filename}` : req.body.image_url;
    
    db.query('INSERT INTO placement_stories (student_name, course, company, package, story, image_url) VALUES (?, ?, ?, ?, ?, ?)', 
    [student_name, course, company, package, story, image_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Success story submitted for approval', id: result.insertId });
    });
});

app.put('/api/placement-stories/:id', verifyToken, (req, res) => {
    const { status } = req.body;
    db.query('UPDATE placement_stories SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Story status updated' });
    });
});

app.delete('/api/placement-stories/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM placement_stories WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Story deleted' });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
