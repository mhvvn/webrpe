-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed password
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- News Table
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT,
    image_url TEXT,
    published_at DATE DEFAULT CURRENT_DATE,
    author_name VARCHAR(100),
    category VARCHAR(50),
    gallery_urls TEXT[], -- Array of strings
    pdf_url TEXT,
    pdf_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lecturers Table
CREATE TABLE lecturers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    specialization TEXT, -- Changed to TEXT for longer list
    email VARCHAR(100),
    email_secondary VARCHAR(100), -- Added secondary email
    image_url TEXT,
    nik VARCHAR(50),
    program_study VARCHAR(100),
    last_education VARCHAR(100),
    education_history TEXT[],
    social_links JSONB, -- Store structured social links
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE courses (
    code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    type VARCHAR(20),
    semester INTEGER,
    credits INTEGER,
    credits_theory INTEGER,
    credits_seminar INTEGER,
    credits_practicum INTEGER,
    description TEXT,
    syllabus_url TEXT,
    learning_outcomes_general TEXT[],
    "references" TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Facilities Table
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    capacity INTEGER,
    gallery_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Seed Data (Optional - Mimicking constants.ts)
INSERT INTO users (username, password, name, role, avatar_url) VALUES
('superadmin', '$2b$10$YhfcdGoKxdRw5HrtXS1jPO8p0vEi0ycKuY4dPxwUm5KJWJ0vqgWF.', 'Super Administrator', 'super_admin', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100'),
('dosen', '$2b$10$YhfcdGoKxdRw5HrtXS1jPO8p0vEi0ycKuY4dPxwUm5KJWJ0vqgWF.', 'Dr. Eng. Budi Santoso', 'lecturer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100');

-- Ensure passwords are set correctly (merged from fix_passwords.sql)
UPDATE users 
SET password = '$2b$10$YhfcdGoKxdRw5HrtXS1jPO8p0vEi0ycKuY4dPxwUm5KJWJ0vqgWF.' 
WHERE username IN ('superadmin', 'dosen');
