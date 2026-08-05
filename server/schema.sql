-- Create Database if not exists

USE lms_production;

-- Drop tables in reverse dependency order to prevent constraint errors
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS lesson_progress;
DROP TABLE IF EXISTS event_enrollments;
DROP TABLE IF EXISTS course_enrollments;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS internship_applications;
DROP TABLE IF EXISTS internships;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS gallery_images;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS students;

-- 1. Students Table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT '',
    isVerified BOOLEAN DEFAULT FALSE,
    otp VARCHAR(6) DEFAULT NULL,
    otpExpiresAt DATETIME DEFAULT NULL,
    study_mon DOUBLE DEFAULT 0.0,
    study_tue DOUBLE DEFAULT 0.0,
    study_wed DOUBLE DEFAULT 0.0,
    study_thu DOUBLE DEFAULT 0.0,
    study_fri DOUBLE DEFAULT 0.0,
    study_sat DOUBLE DEFAULT 0.0,
    study_sun DOUBLE DEFAULT 0.0,
    study_week_start VARCHAR(20) DEFAULT '',
    reset_otp VARCHAR(6) DEFAULT NULL,
    reset_otp_expires DATETIME DEFAULT NULL,
    reset_count INT DEFAULT 0,
    last_reset_date VARCHAR(20) DEFAULT '',
    token_version INT DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admins Table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token_version INT DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Courses Table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    thumbnail MEDIUMTEXT,
    price DECIMAL(10, 2) DEFAULT 0.00,
    category VARCHAR(255) DEFAULT '',
    isFeatured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 4.80,
    enrolledCount INT DEFAULT 0,
    totalDuration INT DEFAULT 480,
    totalLessons INT DEFAULT 12,
    previewVideo TEXT,
    type VARCHAR(50) DEFAULT 'online',
    language VARCHAR(255) DEFAULT 'English (Subtitles available)',
    isCertificateIncluded BOOLEAN DEFAULT TRUE,
    modules TEXT,
    learningOutcomes TEXT,
    certificateTemplate LONGTEXT,
    certificateLayout TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Course Enrollments Table
CREATE TABLE course_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    courseId INT NOT NULL,
    enrolledAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_course (studentId, courseId),
    INDEX idx_enrollment_student (studentId),
    INDEX idx_enrollment_course (courseId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Events Table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    thumbnail MEDIUMTEXT,
    paymentAmount DECIMAL(10, 2) DEFAULT 0.00,
    isPaymentEnabled BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Event Enrollments Table
CREATE TABLE event_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    agreedToTerms BOOLEAN DEFAULT FALSE,
    isPaid BOOLEAN DEFAULT FALSE,
    paymentId VARCHAR(255) DEFAULT NULL,
    enrolledAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event_enrollment_event (eventId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Certificates Table
CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    certificateHash VARCHAR(255) NOT NULL UNIQUE,
    student INT NOT NULL,
    course INT NOT NULL,
    issueDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    pdfUrl VARCHAR(255) DEFAULT '',
    qrCodeUrl MEDIUMTEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_course (student, course),
    INDEX idx_certificate_student (student),
    INDEX idx_certificate_course (course)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Seed Default Admin (email: tothayeswanth052@gmail.com, password: Yeshu@140306)
INSERT INTO admins (name, email, password) VALUES 
('Super Admin', 'tothayeswanth052@gmail.com', '$2a$12$DsBWqvrgqrSD.KDoNCktd.3KBgEFnjl83Ycs8YzkAhAGYRreC3RV2');

-- 9. Internships Table
CREATE TABLE IF NOT EXISTS internships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(100) DEFAULT '3 Months (Remote)',
    requirements TEXT,
    skills TEXT,
    stipend VARCHAR(100) DEFAULT 'Unpaid',
    location VARCHAR(255) DEFAULT 'Remote',
    category VARCHAR(255) DEFAULT '',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Internship Applications Table
CREATE TABLE IF NOT EXISTS internship_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    college VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    internshipId INT DEFAULT NULL,
    resumeLink VARCHAR(555),
    statement TEXT,
    status VARCHAR(50) DEFAULT 'applied',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (internshipId) REFERENCES internships(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Lesson Progress Table
CREATE TABLE IF NOT EXISTS lesson_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student INT NOT NULL,
    course INT NOT NULL,
    lesson VARCHAR(255) NOT NULL,
    isCompleted BOOLEAN DEFAULT FALSE,
    watchPosition INT DEFAULT 0,
    lastWatchedAt DATETIME DEFAULT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_course_lesson (student, course, lesson),
    INDEX idx_progress_student (student),
    INDEX idx_progress_course (course)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    college VARCHAR(255) DEFAULT '',
    year VARCHAR(100) DEFAULT '',
    branch VARCHAR(255) DEFAULT '',
    address VARCHAR(255) DEFAULT '',
    message TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url LONGTEXT NOT NULL,
    isHero BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student INT NOT NULL,
    course INT DEFAULT NULL,
    event INT DEFAULT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    provider VARCHAR(50) NOT NULL,
    transactionId VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE SET NULL,
    FOREIGN KEY (event) REFERENCES events(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
