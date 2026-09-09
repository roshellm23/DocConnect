const AppointmentService = require('../services/appointmentService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Controller handling appointment operations
 */
class AppointmentController {
  /**
   * GET /appointments
   * Retrieves all appointments
   */
  static async getAppointments(req, res, next) {
    try {
      const appointments = await AppointmentService.getAllAppointments();
      return sendSuccess(res, 200, appointments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /appointments/:id
   * Retrieves single appointment by ID
   */
  static async getAppointmentById(req, res, next) {
    try {
      const { id } = req.params;
      const appointment = await AppointmentService.getAppointmentById(id);

      if (!appointment) {
        return sendError(res, 404, `Appointment with ID ${id} was not found.`);
      }

      return sendSuccess(res, 200, appointment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /appointments
   * Creates a new appointment
   */
  static async createAppointment(req, res, next) {
    try {
      const {
        patient_name,
        patient_email,
        doctor_name,
        appointment_date,
        appointment_time,
        reason,
      } = req.body;

      const newAppointment = await AppointmentService.createAppointment({
        patient_name,
        patient_email,
        doctor_name,
        appointment_date,
        appointment_time,
        reason,
      });

      return sendSuccess(
        res,
        201,
        newAppointment,
        'Appointment created successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /appointments/:id
   * Cancels and deletes an appointment
   */
  static async deleteAppointment(req, res, next) {
    try {
      const { id } = req.params;
      const deletedAppointment = await AppointmentService.deleteAppointment(id);

      if (!deletedAppointment) {
        return sendError(res, 404, `Appointment with ID ${id} was not found or already deleted.`);
      }

      return sendSuccess(
        res,
        200,
        deletedAppointment,
        'Appointment deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AppointmentController;
