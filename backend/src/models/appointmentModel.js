const db = require('../config/database');

class AppointmentModel {
  /**
   * Find all appointments ordered by appointment_date and appointment_time
   */
  static async findAll() {
    const text = `
      SELECT 
        id, 
        patient_name, 
        patient_email, 
        doctor_name, 
        TO_CHAR(appointment_date, 'YYYY-MM-DD') AS appointment_date, 
        appointment_time, 
        reason, 
        status, 
        created_at, 
        updated_at
      FROM appointments
      ORDER BY appointment_date ASC, appointment_time ASC;
    `;
    const result = await db.query(text);
    return result.rows;
  }

  /**
   * Find appointment by ID
   * @param {number} id 
   */
  static async findById(id) {
    const text = `
      SELECT 
        id, 
        patient_name, 
        patient_email, 
        doctor_name, 
        TO_CHAR(appointment_date, 'YYYY-MM-DD') AS appointment_date, 
        appointment_time, 
        reason, 
        status, 
        created_at, 
        updated_at
      FROM appointments
      WHERE id = $1;
    `;
    const result = await db.query(text, [id]);
    return result.rows[0] || null;
  }

  /**
   * Create new appointment
   */
  static async create({ patient_name, patient_email, doctor_name, appointment_date, appointment_time, reason, status = 'scheduled' }) {
    const text = `
      INSERT INTO appointments (
        patient_name, 
        patient_email, 
        doctor_name, 
        appointment_date, 
        appointment_time, 
        reason, 
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id, 
        patient_name, 
        patient_email, 
        doctor_name, 
        TO_CHAR(appointment_date, 'YYYY-MM-DD') AS appointment_date, 
        appointment_time, 
        reason, 
        status, 
        created_at, 
        updated_at;
    `;
    const values = [
      patient_name.trim(),
      patient_email.trim().toLowerCase(),
      doctor_name.trim(),
      appointment_date,
      appointment_time.trim(),
      reason.trim(),
      status,
    ];
    const result = await db.query(text, values);
    return result.rows[0];
  }

  /**
   * Delete appointment by ID
   * @param {number} id 
   */
  static async delete(id) {
    const text = `
      DELETE FROM appointments
      WHERE id = $1
      RETURNING 
        id, 
        patient_name, 
        doctor_name, 
        TO_CHAR(appointment_date, 'YYYY-MM-DD') AS appointment_date, 
        appointment_time;
    `;
    const result = await db.query(text, [id]);
    return result.rows[0] || null;
  }
}

module.exports = AppointmentModel;
