const AppointmentService = require('../services/appointmentService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class AppointmentController {
  /**
   * GET /appointments
   * - Admin: gets all appointments
   * - Patient: gets only their own appointments
   */
  static async getAppointments(req, res, next) {
    try {
      let appointments;
      if (req.user.role === 'admin') {
        appointments = await AppointmentService.getAllAppointments();
      } else {
        appointments = await AppointmentService.getAppointmentsByUserId(req.user.id);
      }
      return sendSuccess(res, 200, appointments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /appointments/:id
   * Patients can only view their own appointments
   */
  static async getAppointmentById(req, res, next) {
    try {
      const { id } = req.params;
      const appointment = await AppointmentService.getAppointmentById(id);

      if (!appointment) {
        return sendError(res, 404, `Appointment with ID ${id} was not found.`);
      }

      // Ownership check: patients can only access their own appointments
      if (req.user.role !== 'admin' && appointment.user_id !== req.user.id) {
        return sendError(res, 403, 'You do not have permission to view this appointment.');
      }

      return sendSuccess(res, 200, appointment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /appointments
   * Patient identity comes from JWT — not from request body
   */
  static async createAppointment(req, res, next) {
    try {
      const {
        doctor_name,
        appointment_date,
        appointment_time,
        reason,
      } = req.body;

      const newAppointment = await AppointmentService.createAppointment({
        user_id: req.user.id,
        patient_name: req.user.full_name,
        patient_email: req.user.email,
        doctor_name,
        appointment_date,
        appointment_time,
        reason,
      });

      return sendSuccess(res, 201, newAppointment, 'Appointment booked successfully.');
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }

  /**
   * PATCH /appointments/:id/status
   * Admin only — update appointment status
   */
  static async updateAppointmentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return sendError(res, 400, 'Status field is required.');
      }

      const updated = await AppointmentService.updateAppointmentStatus(id, status);
      return sendSuccess(res, 200, updated, `Appointment status updated to "${status}".`);
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }

  /**
   * DELETE /appointments/:id
   * Patients can cancel their own appointments
   * Admins can cancel any
   */
  static async deleteAppointment(req, res, next) {
    try {
      const { id } = req.params;
      
      // Fetch appointment first to check ownership
      const appointment = await AppointmentService.getAppointmentById(id);
      if (!appointment) {
        return sendError(res, 404, `Appointment with ID ${id} was not found.`);
      }

      // Ownership check for patients
      if (req.user.role !== 'admin' && appointment.user_id !== req.user.id) {
        return sendError(res, 403, 'You do not have permission to cancel this appointment.');
      }

      const deletedAppointment = await AppointmentService.deleteAppointment(id);
      return sendSuccess(res, 200, deletedAppointment, 'Appointment cancelled successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AppointmentController;
