const request = require('supertest');
const { app } = require('../src/server');
const UserModel = require('../src/models/userModel');
const bcrypt = require('bcryptjs');

// Mock UserModel for deterministic, repeatable test runs
jest.mock('../src/models/userModel');

// Mock Database Pool
jest.mock('../src/config/database', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  pool: {
    query: jest.fn().mockResolvedValue({ rows: [{ is_healthy: 1 }] }),
  },
}));

describe('Authentication API Endpoints (/auth and /api/auth)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should register a new patient user and return 201 with token', async () => {
      UserModel.findByEmail.mockResolvedValue(null);
      UserModel.create.mockResolvedValue({
        id: 10,
        full_name: 'Test Patient',
        email: 'newpatient@example.com',
        phone: '+91-9988776655',
        role: 'patient',
        created_at: new Date().toISOString(),
      });

      const res = await request(app)
        .post('/auth/signup')
        .send({
          full_name: 'Test Patient',
          email: 'newpatient@example.com',
          phone: '+91-9988776655',
          password: 'securePassword123!',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'newpatient@example.com');
      expect(res.body.data.user).not.toHaveProperty('password_hash');
    });

    it('should return 409 Conflict when email is already registered', async () => {
      UserModel.findByEmail.mockResolvedValue({
        id: 2,
        email: 'existing@example.com',
      });

      const res = await request(app)
        .post('/auth/signup')
        .send({
          full_name: 'Existing User',
          email: 'existing@example.com',
          phone: '+91-9988776655',
          password: 'password123',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should return 400 when full_name or email is missing', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({
          email: 'noname@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when password is shorter than 6 characters', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({
          full_name: 'Short Pass',
          email: 'shortpass@example.com',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    it('should log in a valid user and return 200 with JWT token', async () => {
      const hashedPassword = await bcrypt.hash('validPassword123', 10);
      UserModel.findByEmail.mockResolvedValue({
        id: 1,
        full_name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        password_hash: hashedPassword,
        role: 'patient',
      });

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'aarav.sharma@example.com',
          password: 'validPassword123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('aarav.sharma@example.com');
    });

    it('should return 401 when password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      UserModel.findByEmail.mockResolvedValue({
        id: 1,
        email: 'aarav.sharma@example.com',
        password_hash: hashedPassword,
        role: 'patient',
      });

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'aarav.sharma@example.com',
          password: 'wrongPassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    it('should return 401 when user is not found', async () => {
      UserModel.findByEmail.mockResolvedValue(null);

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nobody@example.com',
          password: 'somePassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    it('should return 400 for malformed request with missing email or password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'aarav.sharma@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Route Aliasing: POST /api/auth/login', () => {
    it('should succeed through reverse-proxied /api/auth/login alias', async () => {
      const hashedPassword = await bcrypt.hash('validPassword123', 10);
      UserModel.findByEmail.mockResolvedValue({
        id: 1,
        full_name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        password_hash: hashedPassword,
        role: 'patient',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'aarav.sharma@example.com',
          password: 'validPassword123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });
  });

  describe('GET /auth/me - Access Control & Token Validation', () => {
    it('should return 401 when Authorization header is missing', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 when token is invalid or malformed', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token-string');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
