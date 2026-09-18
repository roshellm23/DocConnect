const { Pool } = require('pg');
require('dotenv').config();

// ── Startup guard: catch missing DB credentials before they produce cryptic errors ──
if (!process.env.DATABASE_URL) {
  if (!process.env.DB_PASSWORD && process.env.DB_PASSWORD !== '') {
    // DB_PASSWORD is literally undefined — .env file is probably missing
    console.error('[Database] ⚠  DB_PASSWORD is not set in your .env file.');
    console.error('[Database]    Copy backend/.env.example → backend/.env and fill in your PostgreSQL credentials.');
  }
}

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'docconnect',
      user: process.env.DB_USER || 'postgres',
      // Always pass a string — undefined causes the SASL "client password must be a string" error
      password: String(process.env.DB_PASSWORD ?? ''),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

/**
 * Execute parameterized query
 * @param {string} text 
 * @param {Array} params 
 * @returns {Promise<pg.QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

/**
 * Health check test connection to database
 * @returns {Promise<boolean>}
 */
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as database_name');
    console.log(`[Database] Connected successfully to "${res.rows[0].database_name}" at ${res.rows[0].current_time}`);
    return true;
  } catch (error) {
    console.error('[Database] Connection failed:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  query,
  testConnection,
};
