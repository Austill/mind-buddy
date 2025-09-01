-- Create database
CREATE DATABASE serenitree_db;
USE serenitree_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    subscription_type ENUM('free', 'premium') DEFAULT 'free',
    subscription_expires_at DATETIME NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    preferred_language VARCHAR(10) DEFAULT 'en'
);

-- Mental health profiles
CREATE TABLE mental_health_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    mental_health_conditions JSON,
    therapy_goals TEXT,
    trigger_words JSON,
    preferred_communication_style ENUM('casual', 'formal', 'empathetic', 'direct') DEFAULT 'empathetic',
    crisis_contact_name VARCHAR(100),
    crisis_contact_phone VARCHAR(20),
    emergency_contact_email VARCHAR(255),
    medication_reminders BOOLEAN DEFAULT FALSE,
    daily_check_in_time TIME DEFAULT '09:00:00',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mood tracking
CREATE TABLE mood_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    mood_score INT NOT NULL CHECK (mood_score BETWEEN 1 AND 10),
    mood_type ENUM('happy', 'sad', 'anxious', 'stressed', 'calm', 'angry', 'excited', 'depressed', 'neutral') NOT NULL,
    energy_level INT CHECK (energy_level BETWEEN 1 AND 10),
    sleep_hours DECIMAL(3,1),
    sleep_quality INT CHECK (sleep_quality BETWEEN 1 AND 10),
    notes TEXT,
    triggers JSON,
    activities JSON,
    location VARCHAR(100),
    weather VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_recorded DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, date_recorded)
);

-- Chat conversations
CREATE TABLE conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255),
    conversation_type ENUM('general', 'crisis', 'goal_setting', 'mood_check', 'therapy') DEFAULT 'general',
    session_duration INT DEFAULT 0, -- in minutes
    mood_before INT CHECK (mood_before BETWEEN 1 AND 10),
    mood_after INT CHECK (mood_after BETWEEN 1 AND 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat messages
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT NOT NULL,
    sender ENUM('user', 'ai') NOT NULL,
    content TEXT NOT NULL,
    message_type ENUM('text', 'image', 'audio', 'exercise', 'assessment') DEFAULT 'text',
    metadata JSON, -- for storing additional data like exercise instructions, assessment results
    sentiment_score DECIMAL(3,2), -- -1 to 1
    emotion_detected VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason VARCHAR(255),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    INDEX idx_conversation_created (conversation_id, created_at)
);

-- Goals and objectives
CREATE TABLE therapy_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type ENUM('short_term', 'long_term', 'daily', 'weekly', 'monthly') DEFAULT 'short_term',
    target_date DATE,
    status ENUM('active', 'completed', 'paused', 'cancelled') DEFAULT 'active',
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Goal progress tracking
CREATE TABLE goal_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    goal_id INT NOT NULL,
    progress_note TEXT,
    progress_value INT CHECK (progress_value BETWEEN 0 AND 100),
    milestone_reached VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES therapy_goals(id) ON DELETE CASCADE
);

-- Mental health assessments
CREATE TABLE assessments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    assessment_type ENUM('PHQ9', 'GAD7', 'custom', 'daily_checkin') NOT NULL,
    questions JSON NOT NULL,
    answers JSON NOT NULL,
    total_score INT,
    severity_level ENUM('minimal', 'mild', 'moderate', 'moderately_severe', 'severe'),
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Coping strategies and resources
CREATE TABLE coping_strategies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    strategy_type ENUM('breathing', 'meditation', 'exercise', 'journaling', 'social', 'creative', 'cognitive') NOT NULL,
    instructions TEXT,
    duration_minutes INT,
    effectiveness_rating INT CHECK (effectiveness_rating BETWEEN 1 AND 10),
    usage_count INT DEFAULT 0,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Crisis situations and interventions
CREATE TABLE crisis_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    crisis_level ENUM('low', 'medium', 'high', 'emergency') NOT NULL,
    trigger_description TEXT,
    intervention_taken TEXT,
    professional_contacted BOOLEAN DEFAULT FALSE,
    professional_contact_info VARCHAR(255),
    resolution_status ENUM('ongoing', 'resolved', 'escalated') DEFAULT 'ongoing',
    follow_up_needed BOOLEAN DEFAULT TRUE,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Medication tracking
CREATE TABLE medications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    prescribed_by VARCHAR(255),
    start_date DATE,
    end_date DATE,
    side_effects TEXT,
    effectiveness_rating INT CHECK (effectiveness_rating BETWEEN 1 AND 10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Medication reminders and logs
CREATE TABLE medication_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medication_id INT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    taken_time DATETIME,
    status ENUM('pending', 'taken', 'missed', 'skipped') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
);

-- Subscription and payment tracking
CREATE TABLE subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan_type ENUM('premium_monthly', 'premium_yearly') NOT NULL,
    payment_provider ENUM('stripe', 'paypal', 'instasend', 'flutterwave', 'paystack', 'paga') NOT NULL,
    external_subscription_id VARCHAR(255),
    status ENUM('active', 'cancelled', 'expired', 'pending') DEFAULT 'pending',
    current_period_start DATE,
    current_period_end DATE,
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payment transactions
CREATE TABLE payment_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subscription_id INT,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_provider VARCHAR(50) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    provider_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);

-- Therapist profiles (for premium features)
CREATE TABLE therapists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    specializations JSON,
    bio TEXT,
    avatar_url VARCHAR(500),
    license_number VARCHAR(100),
    years_experience INT,
    hourly_rate DECIMAL(8,2),
    availability JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Therapy sessions (premium feature)
CREATE TABLE therapy_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    therapist_id INT NOT NULL,
    session_type ENUM('video', 'audio', 'chat') DEFAULT 'video',
    scheduled_time DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    session_notes TEXT,
    homework_assigned TEXT,
    next_session_recommended BOOLEAN DEFAULT FALSE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (therapist_id) REFERENCES therapists(id) ON DELETE CASCADE
);

-- Analytics and usage tracking
CREATE TABLE user_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    session_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_event_date (user_id, event_type, created_at)
);

-- System notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('reminder', 'alert', 'update', 'promotion', 'crisis') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    send_via JSON, -- email, push, sms
    scheduled_for DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
