const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const {
  validateCreateAppointment,
  validateAppointmentId,
} = require('../middleware/validationMiddleware');

/**
 * @route   GET /appointments
 * @desc    Get appointments (own for patient, all for admin)
 * @access  Private
 */
router.get('/', authenticate, AppointmentController.getAppointments);

/**
 * @route   POST /appointments
 * @desc    Create a new appointment (patient identity from JWT)
 * @access  Private
 */
router.post('/', authenticate, validateCreateAppointment, AppointmentController.createAppointment);

/**
 * @route   GET /appointments/:id
 * @desc    Get appointment details (with ownership check)
 * @access  Private
 */
router.get('/:id', authenticate, validateAppointmentId, AppointmentController.getAppointmentById);

/**
 * @route   PATCH /appointments/:id/status
 * @desc    Update appointment status
 * @access  Private (Admin only)
 */
router.patch('/:id/status', authenticate, requireAdmin, validateAppointmentId, AppointmentController.updateAppointmentStatus);

/**
 * @route   DELETE /appointments/:id
 * @desc    Cancel appointment (own for patient, any for admin)
 * @access  Private
 */
router.delete('/:id', authenticate, validateAppointmentId, AppointmentController.deleteAppointment);

module.exports = router;
