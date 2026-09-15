const { pool } = require('./database');

/**
 * Initializes database schema and runs non-destructive migrations
 * Ensures users table exists, user_id column exists on appointments,
 * google_id exists on users, and seed admin/demo records are present without wiping existing appointments.
 */
const initDatabase = async () => {
  try {
    // 1. Create users table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password_hash VARCHAR(255),
        google_id VARCHAR(100),
        role VARCHAR(20) NOT NULL DEFAULT 'patient',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT chk_user_role CHECK (role IN ('patient', 'admin'))
      );
    `);

    // 2. Indexes for users
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    `);

    // 3. Alter existing users table for Google OAuth compatibility if upgraded from v2
    await pool.query(`
      ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(100);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users (google_id);
    `);

    // 4. Add user_id column to appointments if not exists
    await pool.query(`
      ALTER TABLE appointments 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
    `);

    // 5. Index on appointments.user_id
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments (user_id);
    `);

    // 6. Update trigger function & triggers
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_users_modtime ON users;
      CREATE TRIGGER update_users_modtime
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_modified_column();
    `);

    // 7. Seed default users if table is empty or missing admin
    const defaultHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

    await pool.query(`
      INSERT INTO users (full_name, email, phone, password_hash, role)
      VALUES
      (
        'Admin DocConnect',
        'admin@docconnect.com',
        '+91-9000000001',
        $1,
        'admin'
      ),
      (
        'Aarav Sharma',
        'aarav.sharma@example.com',
        '+91-9876543210',
        $1,
        'patient'
      ),
      (
        'Priya Patel',
        'priya.patel@example.com',
        '+91-9876543211',
        $1,
        'patient'
      )
      ON CONFLICT (email) DO NOTHING;
    `, [defaultHash]);

    // 8. Backfill user_id on existing appointments by matching patient_email
    await pool.query(`
      UPDATE appointments a
      SET user_id = u.id
      FROM users u
      WHERE a.patient_email = u.email AND a.user_id IS NULL;
    `);

    console.log('[Database] Schema migrations and seed checks completed successfully.');
    return true;
  } catch (error) {
    console.error('[Database] Migration failed:', error.message);
    throw error;
  }
};

module.exports = { initDatabase };

// Allow direct execution: node src/config/initDb.js
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database initialization done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal initialization error:', err);
      process.exit(1);
    });
}
