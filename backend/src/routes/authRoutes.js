const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @route   POST /auth/signup
 * @desc    Register a new patient account
 * @access  Public
 */
router.post('/signup', AuthController.signup);

/**
 * @route   POST /auth/login
 * @desc    Login and receive JWT
 * @access  Public
 */
router.post('/login', AuthController.login);

/**
 * @route   POST /auth/google
 * @desc    Sign in or Register via Google OAuth ID token
 * @access  Public
 */
router.post('/google', AuthController.googleLogin);

/**
 * @route   GET /auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
router.get('/me', authenticate, AuthController.getMe);

/**
 * @route   PATCH /auth/me
 * @desc    Update current user profile (name, phone)
 * @access  Private
 */
router.patch('/me', authenticate, AuthController.updateProfile);

module.exports = router;
