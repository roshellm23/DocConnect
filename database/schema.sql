-- DocConnect - PostgreSQL Database Schema
-- Person 1: Application Layer & Database Setup

-- Create Database (Run separately if needed)
-- CREATE DATABASE docconnect;

-- Drop table if exists for clean migrations/resets
DROP TABLE IF EXISTS appointments CASCADE;

-- Create appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_appointment_status CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled'))
);

-- Index for date-based lookups and sorting
CREATE INDEX idx_appointments_date ON appointments (appointment_date DESC);

-- Index for patient email lookups
CREATE INDEX idx_appointments_email ON appointments (patient_email);

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_appointments_modtime
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
