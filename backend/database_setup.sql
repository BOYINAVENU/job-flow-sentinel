
-- Database setup for ETL Job Monitor
-- Run this to create the required tables if they don't exist

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS job_monitor;
USE job_monitor;

-- Table for processed jobs
CREATE TABLE IF NOT EXISTS schedule_processed (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(50) NOT NULL,
    job_stts VARCHAR(20) NOT NULL,
    edl_load_dtm DATETIME,
    job_strt_tm_utc DATETIME,
    job_end_tm_utc DATETIME,
    aplctn_cd VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_job_id (job_id),
    INDEX idx_application (aplctn_cd),
    INDEX idx_status (job_stts),
    INDEX idx_start_time (job_strt_tm_utc)
);

-- Table for skipped jobs
CREATE TABLE IF NOT EXISTS schedule_skipped (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(50) NOT NULL,
    aplctn_cd VARCHAR(10) NOT NULL,
    skip_reason VARCHAR(255),
    skip_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    expected_time DATETIME,
    INDEX idx_job_id (job_id),
    INDEX idx_application (aplctn_cd)
);

-- Table for waiting jobs
CREATE TABLE IF NOT EXISTS schedule_waiting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(50) NOT NULL,
    aplctn_cd VARCHAR(10) NOT NULL,
    condition_type VARCHAR(50), -- 'TIME' or 'DEPENDENCY'
    condition_value TEXT,
    expected_time VARCHAR(50),
    last_run DATETIME,
    frequency VARCHAR(20),
    priority VARCHAR(10) DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_job_id (job_id),
    INDEX idx_application (aplctn_cd),
    INDEX idx_condition_type (condition_type)
);

-- Sample data for testing
INSERT INTO schedule_processed (job_id, job_stts, edl_load_dtm, job_strt_tm_utc, job_end_tm_utc, aplctn_cd) VALUES
('7615132203', 'SUCCESS', NOW(), DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), 'VBCDF'),
('7615132210', 'SUCCESS', NOW(), DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 30 MINUTE), 'VBCDF'),
('7615134444', 'RUNNING', NOW(), DATE_SUB(NOW(), INTERVAL 30 MINUTE), NULL, 'VBCDF'),
('141513976', 'SUCCESS', NOW(), DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR), 'CDCM'),
('7615131059', 'SUCCESS', NOW(), DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), 'ETL');

INSERT INTO schedule_waiting (job_id, aplctn_cd, condition_type, expected_time, last_run, frequency, priority) VALUES
('761513677', 'VBCDF', 'DEPENDENCY', '06:00 AM EST', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Daily', 'High'),
('7615131145', 'VBCDF', 'TIME', 'Every hour', DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Hourly', 'Medium');

INSERT INTO schedule_skipped (job_id, aplctn_cd, skip_reason, expected_time) VALUES
('7615132999', 'VBCDF', 'After 12 AM refresh', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('141513888', 'CDCM', 'Manual skip', DATE_SUB(NOW(), INTERVAL 1 DAY));
