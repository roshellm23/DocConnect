const AuthService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class AuthController {
  /**
   * POST /auth/signup
   */
  static async signup(req, res, next) {
    try {
      const { full_name, email, phone, password } = req.body;
      const { user, token } = await AuthService.signup({ full_name, email, phone, password });
      return sendSuccess(res, 201, { user, token }, 'Account created successfully. Welcome to DocConnect!');
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }

  /**
   * POST /auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login({ email, password });
      return sendSuccess(res, 200, { user, token }, 'Login successful.');
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }

  /**
   * POST /auth/google
   * Authenticate or register using Google OAuth ID token
   */
  static async googleLogin(req, res, next) {
    try {
      const { credential } = req.body;
      if (!credential) {
        return sendError(res, 400, 'Google credential token is missing.');
      }

      const { user, token, isNewUser } = await AuthService.loginWithGoogle(credential);
      const message = isNewUser
        ? 'Account created and verified with Google! Welcome to DocConnect.'
        : 'Signed in with Google successfully.';

      return sendSuccess(res, isNewUser ? 201 : 200, { user, token }, message);
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }

  /**
   * GET /auth/me — requires authenticate middleware
   */
  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getMe(req.user.id);
      return sendSuccess(res, 200, user);
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }

  /**
   * PATCH /auth/me — requires authenticate middleware
   */
  static async updateProfile(req, res, next) {
    try {
      const { full_name, phone } = req.body;
      const user = await AuthService.updateProfile(req.user.id, { full_name, phone });
      return sendSuccess(res, 200, user, 'Profile updated successfully.');
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }
}

module.exports = AuthController;
