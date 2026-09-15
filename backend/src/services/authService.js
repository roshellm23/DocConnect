const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const UserModel = require('../models/userModel');
const EmailService = require('./emailService');

const SALT_ROUNDS = 10;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  /**
   * Register a new patient
   */
  static async signup({ full_name, email, phone, password }) {
    // Check if email already registered
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      const error = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    // Hash password — never store plaintext
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user — role always 'patient' on signup
    const user = await UserModel.create({
      full_name,
      email,
      phone,
      password_hash,
      role: 'patient',
    });

    // Generate JWT
    const token = AuthService.signToken(user);

    // Asynchronously dispatch Welcome Email (non-blocking)
    EmailService.sendWelcomeEmail(user).catch((err) => {
      console.warn('[EmailService Warning] Non-blocking signup email failed:', err.message);
    });

    return { user, token };
  }

  /**
   * Log in with email and password
   */
  static async login({ email, password }) {
    // Fetch user including password_hash
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // Google-only account without password
    if (!user.password_hash && user.google_id) {
      const error = new Error('This account was created using Google Sign-In. Please sign in with Google.');
      error.statusCode = 400;
      throw error;
    }

    // Compare password with stored hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // Build safe user object (no password_hash)
    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const token = AuthService.signToken(safeUser);

    // Asynchronously dispatch Security Login Alert (non-blocking)
    EmailService.sendLoginAlertEmail(safeUser).catch((err) => {
      console.warn('[EmailService Warning] Non-blocking login alert failed:', err.message);
    });

    return { user: safeUser, token };
  }

  /**
   * Log in or Sign up via Google OAuth ID token
   */
  static async loginWithGoogle(credentialToken) {
    if (!credentialToken) {
      const error = new Error('Google credential token is required.');
      error.statusCode = 400;
      throw error;
    }

    let payload;
    try {
      // If GOOGLE_CLIENT_ID is provided, verify against audience
      const verifyOptions = {
        idToken: credentialToken,
      };
      if (process.env.GOOGLE_CLIENT_ID) {
        verifyOptions.audience = process.env.GOOGLE_CLIENT_ID;
      }

      const ticket = await googleClient.verifyIdToken(verifyOptions);
      payload = ticket.getPayload();
    } catch (err) {
      console.error('[GoogleAuth] Token verification failed:', err.message);
      const error = new Error('Failed to verify Google credentials. Please try again.');
      error.statusCode = 401;
      throw error;
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      const error = new Error('Unable to retrieve email from your Google account.');
      error.statusCode = 400;
      throw error;
    }

    // Check if user already exists by Google ID or by Email
    let user = await UserModel.findByGoogleId(googleId);
    let isNewUser = false;

    if (!user) {
      user = await UserModel.findByEmail(email);

      if (user) {
        // Link google_id to existing account
        user = await UserModel.linkGoogleId(user.id, googleId);
      } else {
        // Create new patient account automatically
        isNewUser = true;
        user = await UserModel.create({
          full_name: name || email.split('@')[0],
          email,
          google_id: googleId,
          role: 'patient',
        });
      }
    }

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const token = AuthService.signToken(safeUser);

    // Send welcome email if new account, or login alert if existing
    if (isNewUser) {
      EmailService.sendWelcomeEmail(safeUser).catch((e) => console.warn('[EmailService]', e.message));
    } else {
      EmailService.sendLoginAlertEmail(safeUser).catch((e) => console.warn('[EmailService]', e.message));
    }

    return { user: safeUser, token, isNewUser };
  }

  /**
   * Get authenticated user profile
   */
  static async getMe(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update user profile (name and phone)
   */
  static async updateProfile(userId, { full_name, phone }) {
    const user = await UserModel.updateById(userId, { full_name, phone });
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Sign a JWT token
   */
  static signToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }
}

module.exports = AuthService;
