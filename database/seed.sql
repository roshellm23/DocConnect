-- DocConnect - Synthetic Seed Data
-- Fictional healthcare demonstration records for testing and presentation

-- Clear existing data
TRUNCATE TABLE appointments RESTART IDENTITY;

-- Insert demonstration appointments
INSERT INTO appointments (patient_name, patient_email, doctor_name, appointment_date, appointment_time, reason, status)
VALUES 
(
    'Aarav Sharma',
    'aarav.sharma@example.com',
    'Dr. Ananya Mehta — General Physician',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00 AM',
    'Annual wellness routine checkup and blood pressure consultation',
    'scheduled'
),
(
    'Priya Patel',
    'priya.patel@example.com',
    'Dr. Rahul Shah — Cardiologist',
    CURRENT_DATE + INTERVAL '2 day',
    '11:30 AM',
    'Follow-up electrocardiogram review and mild palpitations inquiry',
    'scheduled'
),
(
    'Rohan Nair',
    'rohan.nair@example.com',
    'Dr. Sara Fernandes — Dermatologist',
    CURRENT_DATE + INTERVAL '3 day',
    '02:15 PM',
    'Evaluation of seasonal skin rash and eczema treatment plan',
    'scheduled'
),
(
    'Sneha Kulkarni',
    'sneha.kulkarni@example.com',
    'Dr. Ananya Mehta — General Physician',
    CURRENT_DATE + INTERVAL '4 day',
    '04:00 PM',
    'Persisting seasonal viral fever and throat discomfort consultation',
    'scheduled'
);
