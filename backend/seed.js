const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '2002',
    database: process.env.DB_NAME || 'university_db'
});

const reviews = [
    ['Arjun Mehta', 5, 'The faculty at ABC University is exceptional. The practical approach to engineering has helped me land a great job.', 'Approved'],
    ['Sneha Rao', 4, 'Great campus life and very supportive placement cell. The infrastructure is world-class.', 'Approved'],
    ['Vikram Singh', 5, 'ABC University provides a perfect blend of modern technology and holistic values. Truly a premium experience.', 'Approved'],
    ['Priya Sharma', 5, 'The research opportunities here are unmatched. I love the inter-disciplinary approach.', 'Pending']
];

const enquiries = [
    ['Rahul Kumar', 'rahul@example.com', '9876543210', 'I want to know about B.Tech CSE fee structure.'],
    ['Anjali Devi', 'anjali@example.com', '8877665544', 'Are there any scholarships for international students?']
];

const placementStories = [
    ['Arjun Mehta', 'B.Tech CSE \'24', 'Google', '24 LPA', 'The coding bootcamps at ABC University were the key to my success. I felt ready from day one of my internship.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Approved'],
    ['Sneha Reddy', 'MBA Global \'24', 'Amazon', '18 LPA', 'The leadership workshops shaped my perspective. Grateful for the placement cell\'s support.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Approved'],
    ['Vikram Singh', 'B.Tech ECE \'23', 'Microsoft', '21 LPA', 'The research projects here are world-class. It helped me stand out in the technical rounds.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Pending'],
    ['Priya Sharma', 'M.Sc Data Science \'24', 'Adobe', '16 LPA', 'The hands-on approach to big data was incredible.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'Pending']
];

const faculties = [
    ['Dr. S. Radhakrishnan', 'Dean & Professor', 'Computer Science', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150'],
    ['Prof. Ananya Rao', 'HOD', 'Management Studies', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'],
    ['Dr. James Wilson', 'Senior Professor', 'Physics', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'],
    ['Mrs. Meera Iyer', 'Asst. Professor', 'Yoga Science', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150']
];

const courses = [
    ['B.Tech Computer Science', 'Engineering', '4 Years', 'Comprehensive program covering AI, ML, and Software Engineering.'],
    ['MBA Global Leadership', 'Management', '2 Years', 'Advanced business program with international exposure.'],
    ['B.Sc Yoga Science', 'Healthcare', '3 Years', 'Unique blend of ancient wisdom and modern health science.'],
    ['M.Tech Data Analytics', 'Engineering', '2 Years', 'Specialized program for big data and predictive modeling.']
];

db.connect(err => {
    if (err) throw err;
    console.log('Connected to DB for seeding...');

    reviews.forEach(r => {
        db.query('INSERT INTO reviews (student_name, rating, comment, status) VALUES (?, ?, ?, ?)', r, (err) => {
            if (err) console.error(err);
        });
    });

    enquiries.forEach(e => {
        db.query('INSERT INTO enquiries (name, email, phone, message) VALUES (?, ?, ?, ?)', e, (err) => {
            if (err) console.error(err);
        });
    });

    placementStories.forEach(s => {
        db.query('INSERT INTO placement_stories (student_name, course, company, package, story, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)', s, (err) => {
            if (err) console.error(err);
        });
    });

    faculties.forEach(f => {
        db.query('INSERT INTO faculties (name, designation, department, image_url) VALUES (?, ?, ?, ?)', f, (err) => {
            if (err) console.error(err);
        });
    });

    courses.forEach(c => {
        db.query('INSERT INTO courses (name, department, duration, description) VALUES (?, ?, ?, ?)', c, (err) => {
            if (err) console.error(err);
        });
    });

    console.log('Fake data inserted successfully!');
    setTimeout(() => db.end(), 2000);
});
