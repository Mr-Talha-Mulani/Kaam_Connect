-- ============================================================
-- KaamConnect Full Database Schema
-- Run this entire file in PostgreSQL (psql or pgAdmin)
-- ============================================================

-- 1. USERS TABLE (core auth)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('job_seeker', 'employer', 'admin')),
  location VARCHAR(255),
  phone VARCHAR(20),
  is_profile_completed BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. JOB SEEKER PROFILES TABLE (extended fields from requirements)
CREATE TABLE IF NOT EXISTS job_seeker_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  date_of_birth DATE,
  phone_number VARCHAR(20) NOT NULL,
  secondary_phone VARCHAR(20),
  residential_address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  id_proof_type VARCHAR(30) CHECK (id_proof_type IN ('aadhaar', 'pan', 'driving_license', 'voter_id', 'passport')),
  id_proof_last4 VARCHAR(4),
  id_proof_encrypted TEXT,
  selfie_url TEXT,
  video_introduction_url TEXT,
  -- Skills and Work Profile
  primary_skill VARCHAR(100),
  primary_skill_level VARCHAR(20) CHECK (primary_skill_level IN ('beginner', 'intermediate', 'expert')),
  years_of_experience INTEGER DEFAULT 0,
  secondary_skills TEXT, -- comma separated
  languages_known TEXT, -- comma separated
  certifications TEXT, -- comma separated
  -- Availability
  work_type_preference VARCHAR(20) CHECK (work_type_preference IN ('full_time', 'part_time', 'daily_wage', 'freelance')),
  available_days_per_week INTEGER CHECK (available_days_per_week BETWEEN 1 AND 7),
  preferred_hours TEXT,
  can_start_immediately BOOLEAN DEFAULT true,
  availability_duration VARCHAR(30),
  -- Physical & Communication
  can_lift_weight BOOLEAN DEFAULT false,
  preferred_communication VARCHAR(20) DEFAULT 'call' CHECK (preferred_communication IN ('call', 'whatsapp', 'sms')),
  language_preference VARCHAR(50) DEFAULT 'en',
  -- Financial
  bank_account_holder VARCHAR(255),
  bank_name VARCHAR(100),
  bank_account_number_encrypted TEXT,
  bank_ifsc VARCHAR(20),
  -- Legal Declarations (checkboxes)
  declares_age_18_plus BOOLEAN DEFAULT false,
  declares_info_accurate BOOLEAN DEFAULT false,
  declares_no_criminal_history BOOLEAN DEFAULT false,
  consents_to_terms BOOLEAN DEFAULT false,
  consents_to_background_check BOOLEAN DEFAULT false,
  -- Stats (updated via triggers/jobs completion)
  jobs_completed INTEGER DEFAULT 0,
  cancellation_rate NUMERIC(5,2) DEFAULT 0,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  -- Qualification
  qualification VARCHAR(30) CHECK (qualification IN ('10th_pass', '12th_pass', 'graduate', 'post_graduate', 'no_formal_education')),
  -- Location for job matching
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. EMPLOYER PROFILES TABLE (extended fields from requirements)
CREATE TABLE IF NOT EXISTS employer_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  -- Owner Info
  owner_name VARCHAR(255) NOT NULL,
  owner_dob DATE,
  owner_phone VARCHAR(20) NOT NULL,
  owner_email VARCHAR(255),
  owner_address TEXT,
  owner_id_proof_type VARCHAR(30) CHECK (owner_id_proof_type IN ('aadhaar', 'pan', 'driving_license', 'voter_id', 'passport')),
  owner_id_proof_last4 VARCHAR(4),
  -- Business Info
  name VARCHAR(255) NOT NULL,
  business_type VARCHAR(20) CHECK (business_type IN ('sole_proprietor', 'partnership', 'company', 'trust')),
  industry VARCHAR(100),
  years_in_operation INTEGER DEFAULT 0,
  num_employees INTEGER DEFAULT 0,
  business_registration_number VARCHAR(100),
  gst_number VARCHAR(50),
  -- Business Location
  business_address TEXT NOT NULL,
  city VARCHAR(100),
  pincode VARCHAR(10),
  landmark VARCHAR(255),
  -- Contact
  business_phone VARCHAR(20),
  business_email VARCHAR(255),
  website VARCHAR(255),
  alternative_contact_name VARCHAR(255),
  alternative_contact_phone VARCHAR(20),
  -- Business Description
  business_description TEXT,
  -- Financial
  bank_account_holder VARCHAR(255),
  bank_name VARCHAR(100),
  bank_account_number_encrypted TEXT,
  bank_ifsc VARCHAR(20),
  payment_method VARCHAR(20) DEFAULT 'both' CHECK (payment_method IN ('cash', 'transfer', 'both')),
  payment_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (payment_frequency IN ('daily', 'weekly', 'monthly')),
  -- Declarations
  complies_minimum_wage BOOLEAN DEFAULT false,
  provides_safe_environment BOOLEAN DEFAULT false,
  no_child_labor BOOLEAN DEFAULT false,
  no_discrimination BOOLEAN DEFAULT false,
  respects_worker_rights BOOLEAN DEFAULT false,
  consents_to_terms BOOLEAN DEFAULT false,
  -- Verification
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  -- Stats
  jobs_posted INTEGER DEFAULT 0,
  workers_hired INTEGER DEFAULT 0,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  -- Alias keep backward compat
  phone_number VARCHAR(20),
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. JOBS TABLE (extended fields)
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'temporary', 'daily_wage')),
  job_duration VARCHAR(50),
  start_date DATE,
  is_recurring BOOLEAN DEFAULT false,
  -- Location
  location VARCHAR(255) NOT NULL,
  area VARCHAR(255),
  landmark TEXT,
  transport_provided BOOLEAN DEFAULT false,
  -- Compensation
  salary_min INTEGER,
  salary_max INTEGER,
  salary TEXT,
  daily_wage INTEGER,
  payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'transfer', 'both')),
  payment_timing VARCHAR(30) DEFAULT 'monthly',
  overtime_rate TEXT,
  -- Schedule
  working_hours_start TIME,
  working_hours_end TIME,
  shift_type VARCHAR(30) DEFAULT 'fixed',
  rest_days TEXT,
  break_duration_minutes INTEGER DEFAULT 60,
  -- Requirements
  skills_required TEXT,
  qualification_required VARCHAR(30) CHECK (qualification_required IN ('10th_pass', '12th_pass', 'graduate', 'post_graduate', 'any')),
  vacancies INTEGER DEFAULT 1,
  physical_requirements TEXT,
  -- Benefits & Safety
  meals_provided BOOLEAN DEFAULT false,
  uniform_provided BOOLEAN DEFAULT false,
  insurance_provided BOOLEAN DEFAULT false,
  safety_equipment_provided BOOLEAN DEFAULT false,
  -- Status
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'paused', 'filled')),
  is_urgent BOOLEAN DEFAULT false,
  applicants_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  job_seeker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  cover_note TEXT,
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, job_seeker_id)
);

-- 6. SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS saved_jobs (
  id SERIAL PRIMARY KEY,
  job_seeker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_seeker_id, job_id)
);

-- 7. RATINGS & REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
  conduct_rating INTEGER CHECK (conduct_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) DEFAULT 'info' CHECK (type IN ('info', 'application_update', 'job_alert', 'review', 'system')),
  is_read BOOLEAN DEFAULT false,
  related_job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SEED DATA: Demo Users & Jobs for testing
-- ============================================================

-- Demo Employer
INSERT INTO users (name, email, password, role, location, phone, is_profile_completed, verification_status)
VALUES 
  ('Priya Sharma', 'employer@kaamconnect.com', '$2b$10$demo_hashed_password_employer', 'employer', 'Mumbai, Maharashtra', '9876543210', true, 'verified'),
  ('Ravi Kumar', 'worker@kaamconnect.com', '$2b$10$demo_hashed_password_worker', 'job_seeker', 'Mumbai, Maharashtra', '9123456789', true, 'verified')
ON CONFLICT (email) DO NOTHING;

-- Demo Employer Profile
INSERT INTO employer_profiles (user_id, owner_name, owner_phone, name, business_address, city, industry, years_in_operation, business_description, phone_number, location)
  SELECT u.id, 'Priya Sharma', '9876543210', 'QuickDeliver Co.', 'Andheri West, Mumbai', 'Mumbai', 'Logistics', 5, 
    'Leading delivery and logistics company in Mumbai, delivering 10,000+ packages daily.', '9876543210', 'Mumbai, Maharashtra'
  FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT (user_id) DO NOTHING;

-- Demo Job Seeker Profile
INSERT INTO job_seeker_profiles (user_id, full_name, phone_number, primary_skill, primary_skill_level, years_of_experience, qualification, location, work_type_preference)
  SELECT u.id, 'Ravi Kumar', '9123456789', 'Delivery', 'intermediate', 2, '12th_pass', 'Mumbai, Maharashtra', 'full_time'
  FROM users u WHERE u.email = 'worker@kaamconnect.com'
ON CONFLICT (user_id) DO NOTHING;

-- Demo Jobs
INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent, working_hours_start, working_hours_end, meals_provided, transport_provided)
SELECT 
  u.id,
  'Delivery Driver',
  'Looking for reliable delivery drivers with valid two-wheeler license. Experience delivering packages is preferred. You will be delivering 50-80 packages per day in Mumbai area.',
  'Delivery',
  'full_time',
  'Mumbai, Maharashtra',
  'Andheri West',
  15000, 20000, '₹15,000 - ₹20,000/month',
  'Driving, Navigation, Two-Wheeler License',
  '12th_pass', 3, 'open', false, '09:00', '18:00', false, false
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent, working_hours_start, working_hours_end)
SELECT 
  u.id,
  'Warehouse Helper',
  'Need helpers for warehouse operations including loading, unloading, and inventory management. Physical fitness required. Training will be provided.',
  'Warehouse',
  'full_time',
  'Navi Mumbai',
  'Vashi',
  12000, 18000, '₹12,000 - ₹18,000/month',
  'Lifting, Inventory, Teamwork',
  '10th_pass', 5, 'open', false, '08:00', '17:00'
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent, working_hours_start, working_hours_end, meals_provided)
SELECT 
  u.id,
  'Restaurant Server',
  'Friendly servers needed for a busy restaurant in Andheri. Experience preferred but not required. You must have good communication skills and a positive attitude.',
  'Restaurant Staff',
  'part_time',
  'Andheri, Mumbai',
  'Andheri East',
  10000, 15000, '₹10,000 - ₹15,000/month',
  'Customer Service, Communication',
  '10th_pass', 2, 'open', false, '11:00', '23:00', true
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent)
SELECT 
  u.id,
  'Retail Sales Associate',
  'Join our retail team at MegaMart Bandra! Help customers, manage inventory, and create great shopping experiences. Weekend shifts mandatory.',
  'Retail',
  'full_time',
  'Bandra, Mumbai',
  'Bandra West',
  13000, 17000, '₹13,000 - ₹17,000/month',
  'Customer Service, Sales, Communication',
  '12th_pass', 4, 'open', false
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent, working_hours_start, working_hours_end)
SELECT 
  u.id,
  'Office Cleaner',
  'Responsible for maintaining cleanliness in office spaces in Lower Parel. Cleaning supplies and equipment provided by employer. Morning shift only.',
  'Cleaner',
  'full_time',
  'Lower Parel, Mumbai',
  'Lower Parel',
  9000, 12000, '₹9,000 - ₹12,000/month',
  'Cleaning, Maintenance',
  '10th_pass', 2, 'open', false, '07:00', '15:00'
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent)
SELECT 
  u.id,
  'Security Guard',
  'Security guards needed for a premium residential complex in Powai. Must be alert, responsible, and physically fit. 24/7 rotating shifts available.',
  'Security Guard',
  'full_time',
  'Powai, Mumbai',
  'Powai',
  14000, 18000, '₹14,000 - ₹18,000/month',
  'Vigilance, Communication, Physical Fitness',
  '10th_pass', 4, 'open', true
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent)
SELECT 
  u.id,
  'Amazon Delivery Partner',
  'Deliver packages for Amazon across Mumbai. Flexible hours and great per-package payouts. Bike and smartphone required.',
  'Delivery',
  'part_time',
  'Thane, Mumbai',
  'Thane West',
  18000, 25000, '₹18,000 - ₹25,000/month',
  'Driving, Navigation, Smartphone',
  '10th_pass', 8, 'open', false
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent)
SELECT 
  u.id,
  'Zomato Delivery Executive',
  'Food delivery executive needed for Zomato. High earnings with tips included. Bike and smartphone mandatory. Flexible shifts morning and evening.',
  'Delivery',
  'full_time',
  'Vashi, Navi Mumbai',
  'Vashi',
  20000, 30000, '₹20,000 - ₹30,000/month',
  'Driving, Navigation, Customer Service',
  '10th_pass', 5, 'open', true
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent)
SELECT 
  u.id,
  'Supermarket Cashier',
  'Billing and customer service at checkout counters in D-Mart Malad. Experience with POS systems preferred.',
  'Retail',
  'full_time',
  'Malad, Mumbai',
  'Malad West',
  14000, 16000, '₹14,000 - ₹16,000/month',
  'Customer Service, Basic Math, POS',
  '12th_pass', 3, 'open', false
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent)
SELECT 
  u.id,
  'Event Setup Helper',
  'Need strong helpers for event setup and dismantling in Juhu. Weekend-only work with good daily payment.',
  'Helper',
  'temporary',
  'Juhu, Mumbai',
  'Juhu',
  5000, 8000, '₹500 - ₹800/day',
  'Heavy Lifting, Teamwork',
  '10th_pass', 6, 'open', false
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (employer_id, title, description, category, job_type, location, area, salary_min, salary_max, salary, skills_required, qualification_required, vacancies, status, is_urgent)
SELECT 
  u.id,
  'Mall Cleaner',
  'Ensure cleanliness of mall floors and restrooms in Phoenix Mall Kurla. Shift-based work with uniform provided.',
  'Cleaner',
  'full_time',
  'Kurla, Mumbai',
  'Kurla',
  11000, 13000, '₹11,000 - ₹13,000/month',
  'Cleaning, Hygiene Standards',
  '10th_pass', 4, 'open', false
FROM users u WHERE u.email = 'employer@kaamconnect.com'
ON CONFLICT DO NOTHING;
