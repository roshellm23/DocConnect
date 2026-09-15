-- DocConnect - PostgreSQL Database Schema (v3)
-- Upgraded: Added users table + user_id FK on appointments + Google OAuth support

-- ============================================================
-- USERS TABLE
-- ============================================================
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255), -- Nullable for Google OAuth authenticated accounts
    google_id VARCHAR(100),     -- Unique Google User ID
    role VARCHAR(20) NOT NULL DEFAULT 'patient',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('patient', 'admin'))
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_google_id ON users (google_id);

-- ============================================================
-- APPOINTMENTS TABLE
-- ============================================================
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
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

-- Indexes
CREATE INDEX idx_appointments_date ON appointments (appointment_date DESC);
CREATE INDEX idx_appointments_email ON appointments (patient_email);
CREATE INDEX idx_appointments_user_id ON appointments (user_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER (shared)
-- ============================================================
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

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
