CREATE DATABASE IF NOT EXISTS university_db;
USE university_db;

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
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin (password is 'admin123' hashed with bcrypt or just plain for now if we don't have bcrypt yet, but let's use a hashed one later)
-- For now, let's just insert a plain one or skip until we have the script.
INSERT IGNORE INTO admins (username, password) VALUES ('admin', '$2a$10$X729Z3zB.Z7H7Z7H7Z7H7u.7Z7H7Z7H7Z7H7Z7H7Z7H7Z7H7Z7H7'); 
-- Note: the above is a dummy hash. I'll handle admin creation in the server script.
