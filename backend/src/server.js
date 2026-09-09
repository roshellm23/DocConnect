const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection, pool } = require('./config/database');
const appointmentRoutes = require('./routes/appointmentRoutes');
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
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev for easy DevOps integration
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

// Health Check Endpoint (useful for Kubernetes liveness/readiness probes)
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
  const responseData = {
    service: 'docconnect-backend',
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: '1.0.0',
  };

  return res.status(isHealthy ? 200 : 503).json(responseData);
});

// Root API Endpoint
app.get('/', (req, res) => {
  return sendSuccess(res, 200, {
    name: 'DocConnect Healthcare Appointment API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: 'GET /health',
      appointments: {
        list: 'GET /appointments',
        create: 'POST /appointments',
        getById: 'GET /appointments/:id',
        delete: 'DELETE /appointments/:id',
      },
    },
  }, 'DocConnect Backend API is running');
});

// Mount Routes
app.use('/appointments', appointmentRoutes);
app.use('/api/appointments', appointmentRoutes); // Alias for flexible reverse proxying

// Error Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server if launched directly
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, async () => {
    console.log(`=========================================`);
    console.log(`🚀 DocConnect API running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/health`);
    console.log(`   Appointments: http://localhost:${PORT}/appointments`);
    console.log(`=========================================`);
    await testConnection();
  });
}

module.exports = { app, server };
