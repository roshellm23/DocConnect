const db = require('../config/database');
const UserModel = require('../models/userModel');
const { DOCTORS } = require('../controllers/doctorController');
const { sendSuccess } = require('../utils/responseHandler');

class AdminController {
  /**
   * GET /admin/appointments
   * All appointments with patient user info joined
   */
  static async getAppointments(req, res, next) {
    try {
      const text = `
        SELECT 
          a.id,
          a.user_id,
          a.patient_name,
          a.patient_email,
          a.doctor_name,
          TO_CHAR(a.appointment_date, 'YYYY-MM-DD') AS appointment_date,
          a.appointment_time,
          a.reason,
          a.status,
          a.created_at,
          a.updated_at,
          u.phone AS patient_phone
        FROM appointments a
        LEFT JOIN users u ON u.id = a.user_id
        ORDER BY a.appointment_date ASC, a.appointment_time ASC;
      `;
      const result = await db.query(text);

      // Stats
      const stats = {
        total: result.rows.length,
        today: result.rows.filter(a => {
          const today = new Date().toISOString().split('T')[0];
          return a.appointment_date === today;
        }).length,
        scheduled: result.rows.filter(a => a.status === 'scheduled').length,
        confirmed: result.rows.filter(a => a.status === 'confirmed').length,
        completed: result.rows.filter(a => a.status === 'completed').length,
        cancelled: result.rows.filter(a => a.status === 'cancelled').length,
      };

      return sendSuccess(res, 200, { appointments: result.rows, stats });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /admin/users
   * All registered patients
   */
  static async getUsers(req, res, next) {
    try {
      const users = await UserModel.findAll();
      return sendSuccess(res, 200, users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /admin/doctors
   * All doctors in the system
   */
  static async getDoctors(req, res, next) {
    try {
      return sendSuccess(res, 200, DOCTORS);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /admin/stats
   * Dashboard overview statistics
   */
  static async getStats(req, res, next) {
    try {
      const today = new Date().toISOString().split('T')[0];

      const appointmentStats = await db.query(`
        SELECT 
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE TO_CHAR(appointment_date, 'YYYY-MM-DD') = $1) AS today,
          COUNT(*) FILTER (WHERE status = 'scheduled') AS scheduled,
          COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed,
          COUNT(*) FILTER (WHERE status = 'completed') AS completed,
          COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
        FROM appointments;
      `, [today]);

      const userStats = await db.query(`
        SELECT COUNT(*) AS total_patients FROM users WHERE role = 'patient';
      `);

      return sendSuccess(res, 200, {
        appointments: appointmentStats.rows[0],
        total_patients: parseInt(userStats.rows[0].total_patients, 10),
        total_doctors: DOCTORS.length,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
