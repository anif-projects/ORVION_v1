-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS lms_production;
USE lms_production;

-- Drop tables in reverse dependency order to prevent constraint errors
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS otps;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS discussions;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS lesson_progresses;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'student', 'instructor', 'moderator') DEFAULT 'student',
    avatar VARCHAR(255) DEFAULT '',
    isVerified BOOLEAN DEFAULT FALSE,
    verificationToken VARCHAR(255),
    resetPasswordToken VARCHAR(255),
    resetPasswordExpires DATETIME,
    status ENUM('active', 'deactivated', 'blocked') DEFAULT 'active',
    lastLogin DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Student Profiles Table
CREATE TABLE student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user INT NOT NULL UNIQUE,
    headline VARCHAR(255) DEFAULT '',
    bio TEXT,
    phone VARCHAR(20) DEFAULT '',
    website VARCHAR(255) DEFAULT '',
    socials JSON, -- Stores github, linkedin, twitter
    learningStreak INT DEFAULT 0,
    lastActiveDate DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255) DEFAULT 'folder',
    color VARCHAR(255) DEFAULT '#4F46E5',
    status VARCHAR(50) DEFAULT 'active',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Courses Table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    thumbnail VARCHAR(255) DEFAULT '',
    previewVideo VARCHAR(255) DEFAULT '',
    category INT NOT NULL,
    instructor INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discountPrice DECIMAL(10, 2) DEFAULT 0.00,
    level ENUM('beginner', 'intermediate', 'advanced', 'all_levels') DEFAULT 'all_levels',
    language VARCHAR(100) DEFAULT 'English',
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    tags JSON, -- Array of strings
    requirements JSON, -- Array of strings
    learningOutcomes JSON, -- Array of strings
    faqs JSON, -- Array of objects: [{question, answer}]
    totalDuration INT DEFAULT 0,
    totalLessons INT DEFAULT 0,
    enrolledCount INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 4.80,
    reviewCount INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (instructor) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_course_slug (slug),
    INDEX idx_course_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Modules Table
CREATE TABLE modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    `order` INT NOT NULL DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_module_course (course),
    UNIQUE KEY uq_course_module_order (course, `order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Lessons Table
CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module INT NOT NULL,
    course INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    videoUrl VARCHAR(255) DEFAULT '',
    duration INT DEFAULT 0,
    `order` INT NOT NULL DEFAULT 1,
    isPreview BOOLEAN DEFAULT FALSE,
    notes TEXT,
    resources JSON, -- Array of objects: [{title, fileUrl, type}]
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module) REFERENCES modules(id) ON DELETE CASCADE,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_lesson_module (module),
    INDEX idx_lesson_course (course)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Payments Table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student INT NOT NULL,
    course INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    provider ENUM('stripe', 'razorpay', 'paypal', 'free') NOT NULL,
    transactionId VARCHAR(255) NOT NULL UNIQUE,
    paymentIntentId VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    receiptUrl VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE RESTRICT,
    INDEX idx_payment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Enrollments Table
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student INT NOT NULL,
    course INT NOT NULL,
    payment INT,
    progressPercentage DECIMAL(5, 2) DEFAULT 0.00,
    completedLessons JSON, -- Array of lesson IDs (integers)
    completedAt DATETIME,
    status ENUM('active', 'completed', 'refunded', 'cancelled') DEFAULT 'active',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (payment) REFERENCES payments(id) ON DELETE SET NULL,
    UNIQUE KEY uq_student_course (student, course),
    INDEX idx_enrollment_student (student),
    INDEX idx_enrollment_course (course)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Lesson Progresses Table
CREATE TABLE lesson_progresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student INT NOT NULL,
    lesson INT NOT NULL,
    course INT NOT NULL,
    isCompleted BOOLEAN DEFAULT FALSE,
    watchPosition INT DEFAULT 0,
    lastWatchedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_lesson (student, lesson),
    INDEX idx_progress_student (student),
    INDEX idx_progress_lesson (lesson)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Certificates Table
CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    certificateHash VARCHAR(255) NOT NULL UNIQUE,
    student INT NOT NULL,
    course INT NOT NULL,
    issueDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    pdfUrl VARCHAR(255),
    qrCodeUrl VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uq_cert_student_course (student, course),
    INDEX idx_certificate_hash (certificateHash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Discussions Table
CREATE TABLE discussions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course INT NOT NULL,
    lesson INT,
    user INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    likes JSON, -- Array of user IDs
    replies JSON, -- Array of reply objects: [{user, content, likes}]
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson) REFERENCES lessons(id) ON DELETE SET NULL,
    FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_discussion_course (course),
    INDEX idx_discussion_user (user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Events Table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('webinar', 'workshop', 'live_qa') DEFAULT 'webinar',
    startTime DATETIME NOT NULL,
    durationMinutes INT DEFAULT 60,
    meetingLink VARCHAR(255),
    capacity INT DEFAULT 100,
    price DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    registeredUsers JSON, -- Array of user IDs
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Settings Table
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    siteName VARCHAR(255) DEFAULT 'LMS Platform',
    supportEmail VARCHAR(255) DEFAULT 'support@lmsplatform.com',
    paymentProvider ENUM('stripe', 'razorpay', 'paypal') DEFAULT 'stripe',
    enableSMTP BOOLEAN DEFAULT TRUE,
    themeColor VARCHAR(50) DEFAULT '#4F46E5',
    maintenanceMode BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. OTPs Table
CREATE TABLE otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_otp_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Refresh Tokens Table
CREATE TABLE refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_refresh_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Audit Logs Table
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user INT,
    action VARCHAR(255) NOT NULL,
    ipAddress VARCHAR(100),
    userAgent VARCHAR(255),
    details JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
