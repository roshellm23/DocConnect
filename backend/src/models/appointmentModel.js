const db = require('../config/database');

class AppointmentModel {
  /**
   * Find all appointments (admin use)
   */
  static async findAll() {
    const text = `
      SELECT 
        id, user_id, patient_name, patient_email, doctor_name, 
        TO_CHAR(appointment_date, 'YYYY-MM-DD') AS appointment_date, 
        appointment_time, reason, status, created_at, updated_at
      FROM appointments
      ORDER BY appointment_date ASC, appointment_time ASC;
    `;
    const result = await db.query(text);
    return result.rows;
  }

  /**
   * Find all appointments for a specific user
   */
  static async findByUserId(userId) {
    const text = `
      SELECT 
        id, user_id, patient_name, patient_email, doctor_name, 
        TO_CHAR(appointment_date, 'YYYY-MM-DD') AS appointment_date, 
        appointment_time, reason, status, created_at, updated_at
      FROM appointments
      WHERE user_id = $1
      ORDER BY appointment_date ASC, appointment_time ASC;
    `;
    const result = await db.query(text, [userId]);
    return result.rows;
  }

  /**
   * Find appointment by ID
   */
  static async findById(id) {
    const text = `
      SELECT 
        id, user_id, patient_name, patient_email, doctor_name, 
        TO_CHAR(appointment_date, 'YYYY-MM-DD') AS appointment_date, 
        appointment_time, reason, status, created_at, updated_at
      FROM appointments
      WHERE id = $1;
    `;
    const result = await db.query(text, [id]);
    return result.rows[0] || null;
  }

  /**
   * Create new appointment
   */
  static async create({ user_id, patient_name, patient_email, doctor_name, appointment_date, appointment_time, reason, status = 'scheduled' }) {
    const text = `
      INSERT INTO appointments (
        user_id, patient_name, patient_email, doctor_name, 
        appointment_date, appointment_time, reason, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING 
        id, user_id, patient_name, patient_email, doctor_name, 
        TO_CHAR(appointment_date, 'YYYY-MM-DD') AS appointment_date, 
        appointment_time, reason, status, created_at, updated_at;
    `;
    const values = [
      user_id || null,
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
   * Update appointment status (admin)
   */
  static async updateStatus(id, status) {
    const text = `
      UPDATE appointments
      SET status = $1
      WHERE id = $2
      RETURNING 
        id, user_id, patient_name, doctor_name, 
        TO_CHAR(appointment_date, 'YYYY-MM-DD') AS appointment_date, 
        appointment_time, status, updated_at;
    `;
    const result = await db.query(text, [status, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete appointment by ID
   */
  static async delete(id) {
    const text = `
      DELETE FROM appointments
      WHERE id = $1
      RETURNING 
        id, patient_name, doctor_name, 
        TO_CHAR(appointment_date, 'YYYY-MM-DD') AS appointment_date, 
        appointment_time;
    `;
    const result = await db.query(text, [id]);
    return result.rows[0] || null;
  }
}

module.exports = AppointmentModel;
