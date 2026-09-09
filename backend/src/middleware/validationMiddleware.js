const { sendError } = require('../utils/responseHandler');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates request payload for creating an appointment
 */
const validateCreateAppointment = (req, res, next) => {
  const {
    patient_name,
    patient_email,
    doctor_name,
    appointment_date,
    appointment_time,
    reason,
  } = req.body;

  const errors = [];

  // Validate patient_name
  if (!patient_name || typeof patient_name !== 'string' || patient_name.trim().length < 2) {
    errors.push({ field: 'patient_name', message: 'Patient name must be at least 2 characters long' });
  } else if (patient_name.trim().length > 100) {
    errors.push({ field: 'patient_name', message: 'Patient name must not exceed 100 characters' });
  }

  // Validate patient_email
  if (!patient_email || typeof patient_email !== 'string') {
    errors.push({ field: 'patient_email', message: 'Email address is required' });
  } else if (!EMAIL_REGEX.test(patient_email.trim())) {
    errors.push({ field: 'patient_email', message: 'Please provide a valid email address' });
  }

  // Validate doctor_name
  if (!doctor_name || typeof doctor_name !== 'string' || doctor_name.trim().length === 0) {
    errors.push({ field: 'doctor_name', message: 'A doctor must be selected' });
  }

  // Validate appointment_date
  if (!appointment_date || typeof appointment_date !== 'string') {
    errors.push({ field: 'appointment_date', message: 'Appointment date is required' });
  } else if (!DATE_REGEX.test(appointment_date)) {
    errors.push({ field: 'appointment_date', message: 'Appointment date must be in YYYY-MM-DD format' });
  } else {
    const parsedDate = new Date(appointment_date);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'appointment_date', message: 'Appointment date is invalid' });
    }
  }

  // Validate appointment_time
  if (!appointment_time || typeof appointment_time !== 'string' || appointment_time.trim().length === 0) {
    errors.push({ field: 'appointment_time', message: 'Appointment time must be selected' });
  }

  // Validate reason
  if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
    errors.push({ field: 'reason', message: 'Reason for visit is required' });
  } else if (reason.trim().length < 5) {
    errors.push({ field: 'reason', message: 'Reason should be at least 5 characters long' });
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed. Please check the provided inputs.', errors);
  }

  next();
};

/**
 * Validates route parameters containing appointment ID
 */
const validateAppointmentId = (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0 || String(parsedId) !== String(id)) {
    return sendError(res, 400, 'Invalid appointment ID parameter. Must be a positive integer.');
  }

  req.params.id = parsedId;
  next();
};

module.exports = {
  validateCreateAppointment,
  validateAppointmentId,
};
