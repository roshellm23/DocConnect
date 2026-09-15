const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection, pool } = require('./config/database');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const { sendSuccess } = require('./utils/responseHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev for DevOps integration
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger in non-test environments
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check Endpoint (Kubernetes liveness/readiness probe)
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const result = await pool.query('SELECT 1 as is_healthy');
    if (result.rows[0]?.is_healthy === 1) {
      dbStatus = 'connected';
    }
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  const isHealthy = dbStatus === 'connected';
  return res.status(isHealthy ? 200 : 503).json({
    service: 'docconnect-backend',
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: '2.0.0',
  });
});

// Root API Endpoint
app.get('/', (req, res) => {
  return sendSuccess(res, 200, {
    name: 'DocConnect Healthcare Appointment API',
    version: '2.0.0',
    status: 'online',
    endpoints: {
      health: 'GET /health',
      auth: {
        signup: 'POST /auth/signup',
        login: 'POST /auth/login',
        me: 'GET /auth/me',
      },
      doctors: 'GET /doctors',
      appointments: {
        list: 'GET /appointments',
        create: 'POST /appointments',
        getById: 'GET /appointments/:id',
        updateStatus: 'PATCH /appointments/:id/status',
        delete: 'DELETE /appointments/:id',
      },
      admin: {
        stats: 'GET /admin/stats',
        appointments: 'GET /admin/appointments',
        users: 'GET /admin/users',
        doctors: 'GET /admin/doctors',
      },
    },
  }, 'DocConnect Backend API v2.0 is running');
});

// Mount Routes
app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/api/appointments', appointmentRoutes); // Alias for DevOps reverse proxying
app.use('/admin', adminRoutes);

// Error Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server if launched directly
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, async () => {
    console.log(`=========================================`);
    console.log(`🚀 DocConnect API v2.0 running on port ${PORT}`);
    console.log(`   Health Check:  http://localhost:${PORT}/health`);
    console.log(`   Auth:          http://localhost:${PORT}/auth`);
    console.log(`   Doctors:       http://localhost:${PORT}/doctors`);
    console.log(`   Appointments:  http://localhost:${PORT}/appointments`);
    console.log(`   Admin:         http://localhost:${PORT}/admin`);
    console.log(`=========================================`);
    const isConnected = await testConnection();
    if (isConnected) {
      const { initDatabase } = require('./config/initDb');
      await initDatabase();
    }
  });
}

module.exports = { app, server };
