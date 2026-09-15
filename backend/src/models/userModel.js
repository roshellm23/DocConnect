const db = require('../config/database');

class UserModel {
  /**
   * Find user by email (for login)
   */
  static async findByEmail(email) {
    const text = `
      SELECT id, full_name, email, phone, password_hash, google_id, role, created_at, updated_at
      FROM users
      WHERE email = $1;
    `;
    const result = await db.query(text, [email.trim().toLowerCase()]);
    return result.rows[0] || null;
  }

  /**
   * Find user by Google ID (for OAuth login)
   */
  static async findByGoogleId(googleId) {
    const text = `
      SELECT id, full_name, email, phone, password_hash, google_id, role, created_at, updated_at
      FROM users
      WHERE google_id = $1;
    `;
    const result = await db.query(text, [googleId]);
    return result.rows[0] || null;
  }

  /**
   * Find user by ID (for auth/me)
   */
  static async findById(id) {
    const text = `
      SELECT id, full_name, email, phone, google_id, role, created_at, updated_at
      FROM users
      WHERE id = $1;
    `;
    const result = await db.query(text, [id]);
    return result.rows[0] || null;
  }

  /**
   * Create a new user (supports regular email/password or Google OAuth)
   */
  static async create({ full_name, email, phone, password_hash, google_id = null, role = 'patient' }) {
    const text = `
      INSERT INTO users (full_name, email, phone, password_hash, google_id, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, full_name, email, phone, google_id, role, created_at;
    `;
    const values = [
      full_name.trim(),
      email.trim().toLowerCase(),
      phone ? phone.trim() : null,
      password_hash || null,
      google_id || null,
      role,
    ];
    const result = await db.query(text, values);
    return result.rows[0];
  }

  /**
   * Link Google ID to existing user by email
   */
  static async linkGoogleId(id, googleId) {
    const text = `
      UPDATE users
      SET google_id = $1
      WHERE id = $2
      RETURNING id, full_name, email, phone, google_id, role, updated_at;
    `;
    const result = await db.query(text, [googleId, id]);
    return result.rows[0] || null;
  }

  /**
   * Update user profile (name and phone only — not email, not role)
   */
  static async updateById(id, { full_name, phone }) {
    const text = `
      UPDATE users
      SET full_name = $1, phone = $2
      WHERE id = $3
      RETURNING id, full_name, email, phone, google_id, role, updated_at;
    `;
    const result = await db.query(text, [full_name.trim(), phone ? phone.trim() : null, id]);
    return result.rows[0] || null;
  }

  /**
   * Get all users (admin view — excludes password_hash)
   */
  static async findAll() {
    const text = `
      SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.phone, 
        u.role, 
        u.google_id,
        u.created_at,
        COUNT(a.id) AS appointment_count
      FROM users u
      LEFT JOIN appointments a ON a.user_id = u.id
      WHERE u.role = 'patient'
      GROUP BY u.id
      ORDER BY u.created_at DESC;
    `;
    const result = await db.query(text);
    return result.rows;
  }
}

module.exports = UserModel;
