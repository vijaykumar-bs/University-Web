const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '2002',
    database: process.env.DB_NAME || 'university_db'
});

const courseNames = [
    ['B.Tech Computer Science & Engineering', 'Engineering', '4 Years', 'Core CSE with focus on programming and algorithms.'],
    ['B.Tech Artificial Intelligence', 'Engineering', '4 Years', 'Specialized track for AI, ML, and Neural Networks.'],
    ['B.Tech Data Science', 'Engineering', '4 Years', 'Big data analytics, statistics, and visualization.'],
    ['B.Tech Electronics & Communication', 'Engineering', '4 Years', 'VLSI, embedded systems, and communication networks.'],
    ['B.Tech Mechanical Engineering', 'Engineering', '4 Years', 'Thermodynamics, robotics, and manufacturing.'],
    ['B.Tech Civil Engineering', 'Engineering', '4 Years', 'Structural design and urban planning.'],
    ['B.Tech Robotics & Automation', 'Engineering', '4 Years', 'Control systems and robotic design.'],
    ['B.Tech Biotechnology', 'Engineering', '4 Years', 'Genetic engineering and clinical research.'],
    ['M.Tech Software Engineering', 'Engineering', '2 Years', 'Advanced software architecture and project management.'],
    ['M.Tech VLSI Design', 'Engineering', '2 Years', 'Micro-chip design and semiconductor technology.'],
    ['M.Tech Renewable Energy', 'Engineering', '2 Years', 'Sustainable energy solutions and grid management.'],
    
    ['MBA Global Management', 'Management', '2 Years', 'Global business strategy and leadership.'],
    ['MBA Finance & Banking', 'Management', '2 Years', 'Investment banking and risk management.'],
    ['MBA Marketing & Branding', 'Management', '2 Years', 'Digital marketing and consumer behavior.'],
    ['MBA Human Resource Management', 'Management', '2 Years', 'Talent acquisition and organizational culture.'],
    ['MBA Business Analytics', 'Management', '2 Years', 'Data-driven decision making for business.'],
    ['BBA General', 'Management', '3 Years', 'Fundamental business administration skills.'],
    ['BBA International Business', 'Management', '3 Years', 'Cross-border trade and global markets.'],
    ['BBA Hospital Administration', 'Management', '3 Years', 'Healthcare management and operational efficiency.'],
    ['B.Com Honors', 'Commerce', '3 Years', 'Advanced accounting and taxation.'],
    ['B.Com Professional', 'Commerce', '3 Years', 'CA/CS focused accounting curriculum.'],
    
    ['B.Sc Nursing', 'Healthcare', '4 Years', 'Professional clinical nursing and patient care.'],
    ['B.Physiotherapy (BPT)', 'Healthcare', '4.5 Years', 'Rehabilitation and physical therapy.'],
    ['B.Sc Yoga Science', 'Healthcare', '3 Years', 'Traditional yoga combined with modern health.'],
    ['B.Sc Medical Imaging Technology', 'Healthcare', '3 Years', 'Radiography and clinical imaging.'],
    ['B.Sc Operation Theatre Tech', 'Healthcare', '3 Years', 'Surgical assistance and OT management.'],
    ['M.Sc Yoga Therapy', 'Healthcare', '2 Years', 'Therapeutic applications of yoga.'],
    ['Master of Public Health (MPH)', 'Healthcare', '2 Years', 'Epidemiology and community health.'],
    ['B.Pharm', 'Healthcare', '4 Years', 'Pharmaceutical sciences and drug design.'],
    
    ['B.Sc Physics Honors', 'Sciences', '3 Years', 'Theoretical and experimental physics.'],
    ['B.Sc Mathematics', 'Sciences', '3 Years', 'Pure and applied mathematics.'],
    ['B.Sc Psychology', 'Sciences', '3 Years', 'Human behavior and clinical psychology.'],
    ['B.Sc Environmental Science', 'Sciences', '3 Years', 'Ecology and conservation biology.'],
    ['M.Sc Clinical Research', 'Sciences', '2 Years', 'Clinical trials and bio-ethics.'],
    ['M.Sc Biotechnology', 'Sciences', '2 Years', 'Advanced molecular biology.'],
    
    ['BA English Literature', 'Humanities', '3 Years', 'Global literature and creative writing.'],
    ['BA Journalism & Mass Comm', 'Humanities', '3 Years', 'Media, reporting, and digital journalism.'],
    ['BA Economics', 'Humanities', '3 Years', 'Micro and macro economics.'],
    ['BA Political Science', 'Humanities', '3 Years', 'Political theory and international relations.'],
    ['Bachelor of Design (B.Des)', 'Arts', '4 Years', 'Product and communication design.'],
    ['Bachelor of Fine Arts (BFA)', 'Arts', '4 Years', 'Visual arts and digital media.'],
    
    ['PhD Computer Science', 'Research', '3-5 Years', 'Doctoral research in computing.'],
    ['PhD Management', 'Research', '3-5 Years', 'Doctoral research in business.'],
    ['PhD Yoga Science', 'Research', '3-5 Years', 'Doctoral research in traditional sciences.'],
    ['PhD Physics', 'Research', '3-5 Years', 'Doctoral research in material science.'],
    
    ['B.Tech Cyber Security', 'Engineering', '4 Years', 'Ethical hacking and network defense.'],
    ['B.Tech Cloud Computing', 'Engineering', '4 Years', 'AWS, Azure and distributed systems.'],
    ['M.Sc Data Science', 'Sciences', '2 Years', 'Predictive modeling and big data.'],
    ['Diploma in Yoga', 'Healthcare', '1 Year', 'Basic yoga training and practice.'],
    ['Diploma in Digital Marketing', 'Management', '6 Months', 'SEO, SEM and social media ads.'],
    ['Certification in AI Ethics', 'Engineering', '3 Months', 'Societal impact of AI.'],
    ['B.Tech Internet of Things (IoT)', 'Engineering', '4 Years', 'Connected devices and smart systems.'],
    ['MBA Supply Chain Management', 'Management', '2 Years', 'Logistics and global supply chains.'],
    ['B.Arch (Architecture)', 'Engineering', '5 Years', 'Building design and urban aesthetics.']
];

db.connect(err => {
    if (err) throw err;
    console.log('Connected to DB for course seeding...');

    // First clear existing courses to avoid duplicates if running multiple times
    db.query('DELETE FROM courses', (err) => {
        if (err) console.error(err);
        
        courseNames.forEach(c => {
            db.query('INSERT INTO courses (name, department, duration, description) VALUES (?, ?, ?, ?)', c, (err) => {
                if (err) console.error(err);
            });
        });

        console.log(`Successfully seeded ${courseNames.length} courses!`);
        setTimeout(() => db.end(), 2000);
    });
});
