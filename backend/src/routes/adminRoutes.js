const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// All admin routes require authentication AND admin role
router.use(authenticate, requireAdmin);

/**
 * @route   GET /admin/stats
 * @desc    Dashboard statistics overview
 */
router.get('/stats', AdminController.getStats);

/**
 * @route   GET /admin/appointments
 * @desc    All appointments with patient info
 */
router.get('/appointments', AdminController.getAppointments);

/**
 * @route   GET /admin/users
 * @desc    All registered patients
 */
router.get('/users', AdminController.getUsers);

/**
 * @route   GET /admin/doctors
 * @desc    All doctors
 */
router.get('/doctors', AdminController.getDoctors);

module.exports = router;
