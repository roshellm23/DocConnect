/**
 * Doctor data — fictional demo healthcare professionals
 * Stored as a constant (no DB table needed for this project scope)
 * Mirrors the DOCTOR_OPTIONS in the frontend utils/formatters.js
 */
const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Ananya Mehta',
    fullTitle: 'Dr. Ananya Mehta — General Physician',
    specialty: 'General Medicine & Family Health',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience: 12,
    experienceLabel: '12 years',
    description: 'Dr. Mehta specializes in preventive care, chronic disease management, and family health. She is known for her patient-first approach and thorough consultations.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availabilityLabel: 'Mon – Fri',
    avatar: 'AM',
    color: '#0284c7',
    rating: 4.9,
    totalPatients: 2400,
  },
  {
    id: 2,
    name: 'Dr. Rahul Shah',
    fullTitle: 'Dr. Rahul Shah — Cardiologist',
    specialty: 'Cardiovascular Health & Diagnostics',
    qualification: 'MBBS, DM (Cardiology)',
    experience: 15,
    experienceLabel: '15 years',
    description: 'Dr. Shah is a senior cardiologist with expertise in ECG interpretation, stress testing, and management of hypertension and coronary artery disease.',
    availability: ['Mon', 'Wed', 'Fri'],
    availabilityLabel: 'Mon, Wed, Fri',
    avatar: 'RS',
    color: '#dc2626',
    rating: 4.8,
    totalPatients: 3100,
  },
  {
    id: 3,
    name: 'Dr. Sara Fernandes',
    fullTitle: 'Dr. Sara Fernandes — Dermatologist',
    specialty: 'Clinical & Cosmetic Dermatology',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 9,
    experienceLabel: '9 years',
    description: 'Dr. Fernandes treats a wide range of skin conditions including eczema, psoriasis, acne, and performs minor cosmetic procedures with evidence-based protocols.',
    availability: ['Tue', 'Thu', 'Sat'],
    availabilityLabel: 'Tue, Thu, Sat',
    avatar: 'SF',
    color: '#0d9488',
    rating: 4.7,
    totalPatients: 1800,
  },
  {
    id: 4,
    name: 'Dr. Vikram Rao',
    fullTitle: 'Dr. Vikram Rao — Orthopedic Specialist',
    specialty: 'Joint & Musculoskeletal Care',
    qualification: 'MBBS, MS (Orthopaedics)',
    experience: 14,
    experienceLabel: '14 years',
    description: 'Dr. Rao focuses on joint replacement consultations, sports injuries, and non-surgical management of back pain and arthritis conditions.',
    availability: ['Mon', 'Tue', 'Thu'],
    availabilityLabel: 'Mon, Tue, Thu',
    avatar: 'VR',
    color: '#7c3aed',
    rating: 4.8,
    totalPatients: 2700,
  },
  {
    id: 5,
    name: 'Dr. Neha Verma',
    fullTitle: 'Dr. Neha Verma — Pediatrician',
    specialty: 'Child Health & Developmental Care',
    qualification: 'MBBS, MD (Paediatrics)',
    experience: 10,
    experienceLabel: '10 years',
    description: 'Dr. Verma provides comprehensive child healthcare from newborn care to adolescent medicine, including vaccination schedules and developmental assessments.',
    availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    availabilityLabel: 'Mon, Wed, Fri, Sat',
    avatar: 'NV',
    color: '#d97706',
    rating: 4.9,
    totalPatients: 2100,
  },
];

const getDoctors = (req, res) => {
  const { sendSuccess } = require('../utils/responseHandler');
  return sendSuccess(res, 200, DOCTORS);
};

const getDoctorById = (req, res) => {
  const { sendSuccess, sendError } = require('../utils/responseHandler');
  const id = parseInt(req.params.id, 10);
  const doctor = DOCTORS.find((d) => d.id === id);
  if (!doctor) {
    return sendError(res, 404, `Doctor with ID ${id} not found.`);
  }
  return sendSuccess(res, 200, doctor);
};

module.exports = { getDoctors, getDoctorById, DOCTORS };
