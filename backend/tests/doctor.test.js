const request = require('supertest');
const { app } = require('../src/server');

// Mock Database Pool
jest.mock('../src/config/database', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  pool: {
    query: jest.fn().mockResolvedValue({ rows: [{ is_healthy: 1 }] }),
  },
}));

describe('Doctors API Endpoints (/doctors and /api/doctors)', () => {
  describe('GET /doctors', () => {
    it('should return 200 and a list of healthcare specialists', async () => {
      const res = await request(app).get('/doctors');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const firstDoctor = res.body.data[0];
      expect(firstDoctor).toHaveProperty('id');
      expect(firstDoctor).toHaveProperty('name');
      expect(firstDoctor).toHaveProperty('specialty');
      expect(firstDoctor).toHaveProperty('availability');
    });

    it('should support reverse-proxied /api/doctors alias', async () => {
      const res = await request(app).get('/api/doctors');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /doctors/:id', () => {
    it('should return doctor details for a valid ID', async () => {
      const res = await request(app).get('/doctors/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', 1);
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).toHaveProperty('qualification');
    });

    it('should return 404 when doctor ID is not found', async () => {
      const res = await request(app).get('/doctors/9999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe('CORS and Preflight Verification', () => {
    it('should handle preflight OPTIONS request with 204 status', async () => {
      const res = await request(app)
        .options('/doctors')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'GET');

      expect(res.status).toBe(204);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should disallow unauthorized cross-origin requests', async () => {
      const res = await request(app)
        .get('/doctors')
        .set('Origin', 'http://malicious-site.example.com');

      // Unauthorized origins should not be echoed back in Access-Control-Allow-Origin
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
});
