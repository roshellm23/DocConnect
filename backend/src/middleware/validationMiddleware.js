const { sendError } = require('../utils/responseHandler');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates request payload for creating an appointment.
 * NOTE: patient_name and patient_email now come from JWT (req.user),
 * so they are no longer required in the request body.
 */
const validateCreateAppointment = (req, res, next) => {
  const {
    doctor_name,
    appointment_date,
    appointment_time,
    reason,
  } = req.body;

  const errors = [];

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
 * Validates signup request payload
 */
const validateSignup = (req, res, next) => {
  const { full_name, email, phone, password, confirm_password } = req.body;
  const errors = [];

  if (!full_name || full_name.trim().length < 2) {
    errors.push({ field: 'full_name', message: 'Full name must be at least 2 characters' });
  }

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (phone && phone.trim().length > 0 && phone.trim().length < 7) {
    errors.push({ field: 'phone', message: 'Phone number appears to be too short' });
  }

  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  if (confirm_password !== undefined && password !== confirm_password) {
    errors.push({ field: 'confirm_password', message: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed.', errors);
  }

  next();
};

/**
 * Validates login request payload
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!password || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed.', errors);
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
  validateSignup,
  validateLogin,
  validateAppointmentId,
};
