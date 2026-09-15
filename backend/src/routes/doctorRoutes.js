const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById } = require('../controllers/doctorController');

/**
 * @route   GET /doctors
 * @desc    Get all doctors
 * @access  Public
 */
router.get('/', getDoctors);

/**
 * @route   GET /doctors/:id
 * @desc    Get doctor by ID
 * @access  Public
 */
router.get('/:id', getDoctorById);

module.exports = router;
