const AppointmentModel = require('../models/appointmentModel');
const EmailService = require('./emailService');

class AppointmentService {
  /**
   * Retrieve all appointments (admin)
   */
  static async getAllAppointments() {
    return await AppointmentModel.findAll();
  }

  /**
   * Retrieve appointments for a specific patient
   */
  static async getAppointmentsByUserId(userId) {
    return await AppointmentModel.findByUserId(userId);
  }

  /**
   * Retrieve appointment by ID
   */
  static async getAppointmentById(id) {
    return await AppointmentModel.findById(id);
  }

  /**
   * Create new appointment and dispatch confirmation email
   */
  static async createAppointment(appointmentData) {
    const newAppointment = await AppointmentModel.create(appointmentData);

    // Asynchronously dispatch confirmation email (non-blocking)
    if (newAppointment && appointmentData.patient_email) {
      EmailService.sendAppointmentConfirmationEmail(
        { email: appointmentData.patient_email, full_name: appointmentData.patient_name },
        newAppointment
      ).catch((err) => {
        console.warn('[EmailService Warning] Non-blocking appointment email failed:', err.message);
      });
    }

    return newAppointment;
  }

  /**
   * Update appointment status (admin only)
   */
  static async updateAppointmentStatus(id, status) {
    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      const error = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    const updated = await AppointmentModel.updateStatus(id, status);
    if (!updated) {
      const error = new Error(`Appointment with ID ${id} was not found.`);
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }

  /**
   * Delete/cancel an appointment
   */
  static async deleteAppointment(id) {
    return await AppointmentModel.delete(id);
  }
}

module.exports = AppointmentService;
