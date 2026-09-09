const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');
const {
  validateCreateAppointment,
  validateAppointmentId,
} = require('../middleware/validationMiddleware');

/**
 * @route   GET /appointments
 * @desc    Get all appointments
 */
router.get('/', AppointmentController.getAppointments);

/**
 * @route   POST /appointments
 * @desc    Create a new appointment
 */
router.post('/', validateCreateAppointment, AppointmentController.createAppointment);

/**
 * @route   GET /appointments/:id
 * @desc    Get appointment details by ID
 */
router.get('/:id', validateAppointmentId, AppointmentController.getAppointmentById);

/**
 * @route   DELETE /appointments/:id
 * @desc    Delete appointment by ID
 */
router.delete('/:id', validateAppointmentId, AppointmentController.deleteAppointment);

module.exports = router;
