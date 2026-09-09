const AppointmentModel = require('../models/appointmentModel');

class AppointmentService {
  /**
   * Retrieve all appointments
   */
  static async getAllAppointments() {
    return await AppointmentModel.findAll();
  }

  /**
   * Retrieve appointment by ID
   * @param {number} id 
   */
  static async getAppointmentById(id) {
    return await AppointmentModel.findById(id);
  }

  /**
   * Create new appointment
   * @param {object} appointmentData 
   */
  static async createAppointment(appointmentData) {
    return await AppointmentModel.create(appointmentData);
  }

  /**
   * Delete an appointment
   * @param {number} id 
   */
  static async deleteAppointment(id) {
    return await AppointmentModel.delete(id);
  }
}

module.exports = AppointmentService;
