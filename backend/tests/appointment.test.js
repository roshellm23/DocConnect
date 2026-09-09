const request = require('supertest');
const { app } = require('../src/server');
const AppointmentModel = require('../src/models/appointmentModel');

// Mock AppointmentModel to test API contract and validation deterministically
jest.mock('../src/models/appointmentModel');

describe('DocConnect API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status payload', async () => {
      const res = await request(app).get('/health');
      expect([200, 503]).toContain(res.status);
      expect(res.body).toHaveProperty('service', 'docconnect-backend');
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /', () => {
    it('should return API discovery and welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('name', 'DocConnect Healthcare Appointment API');
    });
  });

  describe('GET /appointments', () => {
    it('should return 200 and list of appointments', async () => {
      const mockAppointments = [
        {
          id: 1,
          patient_name: 'Aarav Sharma',
          patient_email: 'aarav@example.com',
          doctor_name: 'Dr. Ananya Mehta',
          appointment_date: '2026-09-15',
          appointment_time: '10:00 AM',
          reason: 'Routine checkup',
          status: 'scheduled',
        },
      ];

      AppointmentModel.findAll.mockResolvedValue(mockAppointments);

      const res = await request(app).get('/appointments');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].patient_name).toBe('Aarav Sharma');
    });
  });

  describe('POST /appointments', () => {
    const validAppointment = {
      patient_name: 'Priya Patel',
      patient_email: 'priya.patel@example.com',
      doctor_name: 'Dr. Rahul Shah',
      appointment_date: '2026-09-20',
      appointment_time: '11:30 AM',
      reason: 'Cardiology follow-up and ECG check',
    };

    it('should create an appointment and return 201 when payload is valid', async () => {
      AppointmentModel.create.mockResolvedValue({
        id: 2,
        ...validAppointment,
        status: 'scheduled',
      });

      const res = await request(app)
        .post('/appointments')
        .send(validAppointment);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Appointment created successfully');
      expect(res.body.data.id).toBe(2);
      expect(res.body.data.patient_name).toBe('Priya Patel');
    });

    it('should return 400 when patient_name is missing or too short', async () => {
      const invalidPayload = {
        ...validAppointment,
        patient_name: 'A', // too short (< 2 chars)
      };

      const res = await request(app)
        .post('/appointments')
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'patient_name' }),
        ])
      );
    });

    it('should return 400 when patient_email format is invalid', async () => {
      const invalidPayload = {
        ...validAppointment,
        patient_email: 'not-an-email',
      };

      const res = await request(app)
        .post('/appointments')
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'patient_email' }),
        ])
      );
    });

    it('should return 400 when reason is empty', async () => {
      const invalidPayload = {
        ...validAppointment,
        reason: '',
      };

      const res = await request(app)
        .post('/appointments')
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'reason' }),
        ])
      );
    });
  });

  describe('GET /appointments/:id', () => {
    it('should return appointment details when appointment exists', async () => {
      const mockAppointment = {
        id: 1,
        patient_name: 'Aarav Sharma',
        patient_email: 'aarav@example.com',
        doctor_name: 'Dr. Ananya Mehta',
        appointment_date: '2026-09-15',
        appointment_time: '10:00 AM',
        reason: 'Routine checkup',
        status: 'scheduled',
      };

      AppointmentModel.findById.mockResolvedValue(mockAppointment);

      const res = await request(app).get('/appointments/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(1);
    });

    it('should return 404 when appointment does not exist', async () => {
      AppointmentModel.findById.mockResolvedValue(null);

      const res = await request(app).get('/appointments/999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('was not found');
    });

    it('should return 400 for invalid non-numeric ID parameter', async () => {
      const res = await request(app).get('/appointments/abc');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /appointments/:id', () => {
    it('should delete appointment and return 200 when appointment exists', async () => {
      const deletedRecord = {
        id: 1,
        patient_name: 'Aarav Sharma',
        doctor_name: 'Dr. Ananya Mehta',
        appointment_date: '2026-09-15',
        appointment_time: '10:00 AM',
      };

      AppointmentModel.delete.mockResolvedValue(deletedRecord);

      const res = await request(app).delete('/appointments/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Appointment deleted successfully');
    });

    it('should return 404 when trying to delete non-existent appointment', async () => {
      AppointmentModel.delete.mockResolvedValue(null);

      const res = await request(app).delete('/appointments/888');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('was not found');
    });
  });
});
