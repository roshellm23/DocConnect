-- DocConnect - Seed Users (Admin + Demo Patients)
-- Run AFTER schema.sql
-- Admin password: Admin@123
-- Patient password: Patient@123
-- (Hashes generated with bcrypt cost factor 10)

INSERT INTO users (full_name, email, phone, password_hash, role)
VALUES
(
    'Admin DocConnect',
    'admin@docconnect.com',
    '+91-9000000001',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin'
),
(
    'Aarav Sharma',
    'aarav.sharma@example.com',
    '+91-9876543210',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'patient'
),
(
    'Priya Patel',
    'priya.patel@example.com',
    '+91-9876543211',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'patient'
)
ON CONFLICT (email) DO NOTHING;

-- Seed demo appointments linked to user IDs
-- NOTE: The hash above is the bcrypt hash for "password" (laravel/testing standard hash)
-- For real usage, passwords should be hashed at signup time.
-- Demo: use password "password" for all seed users until you create your own account.

INSERT INTO appointments (user_id, patient_name, patient_email, doctor_name, appointment_date, appointment_time, reason, status)
SELECT
    u.id,
    'Aarav Sharma',
    'aarav.sharma@example.com',
    'Dr. Ananya Mehta — General Physician',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00 AM',
    'Annual wellness routine checkup and blood pressure consultation',
    'scheduled'
FROM users u WHERE u.email = 'aarav.sharma@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO appointments (user_id, patient_name, patient_email, doctor_name, appointment_date, appointment_time, reason, status)
SELECT
    u.id,
    'Priya Patel',
    'priya.patel@example.com',
    'Dr. Rahul Shah — Cardiologist',
    CURRENT_DATE + INTERVAL '2 days',
    '11:30 AM',
    'Follow-up electrocardiogram review and mild palpitations inquiry',
    'confirmed'
FROM users u WHERE u.email = 'priya.patel@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO appointments (user_id, patient_name, patient_email, doctor_name, appointment_date, appointment_time, reason, status)
SELECT
    u.id,
    'Aarav Sharma',
    'aarav.sharma@example.com',
    'Dr. Sara Fernandes — Dermatologist',
    CURRENT_DATE - INTERVAL '5 days',
    '02:15 PM',
    'Evaluation of seasonal skin rash and eczema treatment plan',
    'completed'
FROM users u WHERE u.email = 'aarav.sharma@example.com'
ON CONFLICT DO NOTHING;
