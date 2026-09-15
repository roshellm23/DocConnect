import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Stethoscope, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createAppointment } from '../services/api';
import { DOCTOR_OPTIONS, TIME_SLOTS } from '../utils/formatters';

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const doctorQueryParam = searchParams.get('doctor');

  // Form Fields State (Patient info comes from auth context!)
  const [formData, setFormData] = useState({
    doctor_name: DOCTOR_OPTIONS[0].name,
    appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow by default
    appointment_time: TIME_SLOTS[0],
    reason: '',
  });

  // Pre-select doctor if provided in URL
  useEffect(() => {
    if (doctorQueryParam) {
      const match = DOCTOR_OPTIONS.find((doc) => doc.name === doctorQueryParam);
      if (match) {
        setFormData((prev) => ({ ...prev, doctor_name: match.name }));
      }
    }
  }, [doctorQueryParam]);

  // UI States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const todayString = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctor_name) {
      newErrors.doctor_name = 'Please select a healthcare specialist';
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Please pick a consultation date';
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = 'Please select a time slot';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Please provide a clinical reason for the visit';
    } else if (formData.reason.trim().length < 5) {
      newErrors.reason = 'Reason should be at least 5 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleTimeSelect = (slot) => {
    setFormData((prev) => ({ ...prev, appointment_time: slot }));
    if (errors.appointment_time) {
      setErrors((prev) => ({ ...prev, appointment_time: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Backend automatically grabs patient name & email from the verified JWT
      const response = await createAppointment({
        doctor_name: formData.doctor_name,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        reason: formData.reason,
      });

      setSuccessData(response.data);
      addToast('Appointment booked and confirmed!', 'success');
    } catch (err) {
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        const backendErrors = {};
        err.data.errors.forEach((e) => {
          backendErrors[e.field] = e.message;
        });
        setErrors(backendErrors);
      }
      setServerError(err.message || 'Failed to schedule appointment. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--slate-500)',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="page-title">Book a Healthcare Visit</h1>
          <p className="page-subtitle">
            Schedule a verified specialist consultation. Your booking will be tied directly to your verified patient profile.
          </p>
        </div>

        {/* Authenticated Patient Identification Card */}
        <div
          style={{
            backgroundColor: '#f0fdfa',
            border: '1px solid #99f6e4',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#0d9488',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              <User size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 600 }}>
                Booking consultation as verified patient:
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#134e4a' }}>
                {user?.full_name} <span style={{ fontWeight: 400, fontSize: '0.85rem' }}>({user?.email})</span>
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              backgroundColor: '#ccfbf1',
              color: '#0f766e',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              border: '1px solid #5eead4',
            }}
          >
            ID: #{user?.id}
          </span>
        </div>

        {/* Server Success Feedback */}
        {successData && (
          <div className="alert alert-success" style={{ display: 'block', padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={26} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#15803d', margin: 0 }}>
                Appointment Confirmed & Scheduled!
              </h3>
            </div>
            <p style={{ color: '#166534', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Your appointment (<strong>Ref #{successData.id}</strong>) with <strong>{successData.doctor_name}</strong> on{' '}
              <strong>{successData.appointment_date}</strong> at <strong>{successData.appointment_time}</strong> has been secured in PostgreSQL.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to={`/appointments/${successData.id}`} className="btn btn-primary btn-sm">
                View Appointment Slip <ArrowRight size={14} />
              </Link>
              <Link to="/dashboard" className="btn btn-secondary btn-sm">
                Go to Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSuccessData(null)}
              >
                Book Another Visit
              </button>
            </div>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Booking Notice:</strong> {serverError}
            </div>
          </div>
        )}

        {/* Booking Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="card-body">
            {/* Step 1: Specialist Selection */}
            <div className="form-group">
              <label className="form-label" htmlFor="doctor_name">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Stethoscope size={16} color="#0d9488" /> 1. Select Specialist
                  <span className="required">*</span>
                </span>
              </label>
              <select
                id="doctor_name"
                name="doctor_name"
                className={`form-select ${errors.doctor_name ? 'error' : ''}`}
                value={formData.doctor_name}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {DOCTOR_OPTIONS.map((doc) => (
                  <option key={doc.name} value={doc.name}>
                    {doc.name} — {doc.specialty} ({doc.experience})
                  </option>
                ))}
              </select>
              {errors.doctor_name && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.doctor_name}
                </div>
              )}
            </div>

            {/* Step 2: Date & Selected Slot Header */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="appointment_date">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={16} color="#0d9488" /> 2. Preferred Date
                    <span className="required">*</span>
                  </span>
                </label>
                <input
                  id="appointment_date"
                  name="appointment_date"
                  type="date"
                  min={todayString}
                  className={`form-input ${errors.appointment_date ? 'error' : ''}`}
                  value={formData.appointment_date}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.appointment_date && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.appointment_date}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} color="#0d9488" /> Selected Time Slot
                  </span>
                </label>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{formData.appointment_time}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Standard 45min Visit</span>
                </div>
              </div>
            </div>

            {/* Time Slot Chips Selection */}
            <div className="form-group">
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
                Available Consultation Slots:
              </div>
              <div className="time-slots-grid">
                {TIME_SLOTS.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={`time-slot-chip ${formData.appointment_time === slot ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(slot)}
                    disabled={isSubmitting}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {errors.appointment_time && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.appointment_time}
                </div>
              )}
            </div>

            {/* Step 3: Reason for Consultation */}
            <div className="form-group">
              <label className="form-label" htmlFor="reason">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} color="#0d9488" /> 3. Chief Complaint / Reason for Visit
                  <span className="required">*</span>
                </span>
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                placeholder="Briefly describe your symptoms, consultation history, or health objectives for the specialist..."
                className={`form-textarea ${errors.reason ? 'error' : ''}`}
                value={formData.reason}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.reason && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.reason}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Securing Appointment Slot...</>
                ) : (
                  <>
                    Confirm & Schedule Appointment <Send size={17} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
