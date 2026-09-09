import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Send
} from 'lucide-react';
import { createAppointment } from '../services/api';
import { DOCTOR_OPTIONS, TIME_SLOTS } from '../utils/formatters';

const BookAppointmentPage = () => {
  const navigate = useNavigate();

  // Form Fields State
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    doctor_name: DOCTOR_OPTIONS[0].name,
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: TIME_SLOTS[0],
    reason: '',
  });

  // UI States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  // Today's date string for min date attribute
  const todayString = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Patient name is required';
    } else if (formData.patient_name.trim().length < 2) {
      newErrors.patient_name = 'Patient name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.patient_email.trim()) {
      newErrors.patient_email = 'Email address is required';
    } else if (!emailRegex.test(formData.patient_email.trim())) {
      newErrors.patient_email = 'Please enter a valid email address';
    }

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
      newErrors.reason = 'Please provide a reason for the consultation';
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createAppointment(formData);
      setSuccessData(response.data);
      // Reset form
      setFormData({
        patient_name: '',
        patient_email: '',
        doctor_name: DOCTOR_OPTIONS[0].name,
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: TIME_SLOTS[0],
        reason: '',
      });
    } catch (err) {
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        const backendErrors = {};
        err.data.errors.forEach((e) => {
          backendErrors[e.field] = e.message;
        });
        setErrors(backendErrors);
      }
      setServerError(err.message || 'Failed to submit appointment. Please check your backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/appointments"
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
            <ArrowLeft size={16} /> Back to Appointments
          </Link>
          <h1 className="page-title">Book an Appointment</h1>
          <p className="page-subtitle">
            Fill out the details below to schedule your consultation with a certified doctor.
          </p>
        </div>

        {/* Server Success Feedback */}
        {successData && (
          <div className="alert alert-success" style={{ display: 'block', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={24} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#15803d', margin: 0 }}>
                Appointment Confirmed Successfully!
              </h3>
            </div>
            <p style={{ color: '#166534', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Your appointment (Ref #{successData.id}) has been registered in the PostgreSQL database.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to={`/appointments/${successData.id}`} className="btn btn-primary btn-sm">
                View Appointment Details <ArrowRight size={14} />
              </Link>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSuccessData(null)}
              >
                Book Another
              </button>
            </div>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="alert alert-error">
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Submission Error:</strong> {serverError}
            </div>
          </div>
        )}

        {/* Booking Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="card-body">
            {/* Patient Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="patient_name">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} color="var(--primary)" /> Patient Full Name
                  <span className="required">*</span>
                </span>
              </label>
              <input
                id="patient_name"
                name="patient_name"
                type="text"
                placeholder="e.g. Aarav Sharma"
                className={`form-input ${errors.patient_name ? 'error' : ''}`}
                value={formData.patient_name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.patient_name && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.patient_name}
                </div>
              )}
            </div>

            {/* Patient Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="patient_email">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={15} color="var(--primary)" /> Email Address
                  <span className="required">*</span>
                </span>
              </label>
              <input
                id="patient_email"
                name="patient_email"
                type="email"
                placeholder="e.g. aarav.sharma@example.com"
                className={`form-input ${errors.patient_email ? 'error' : ''}`}
                value={formData.patient_email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.patient_email && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.patient_email}
                </div>
              )}
            </div>

            {/* Doctor Selection */}
            <div className="form-group">
              <label className="form-label" htmlFor="doctor_name">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Stethoscope size={15} color="var(--primary)" /> Healthcare Specialist
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
                    {doc.name} — ({doc.specialty})
                  </option>
                ))}
              </select>
              {errors.doctor_name && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.doctor_name}
                </div>
              )}
            </div>

            {/* Date & Time Grid */}
            <div className="form-grid-2">
              {/* Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="appointment_date">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="var(--primary)" /> Preferred Date
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

              {/* Time Slot Display */}
              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} color="var(--primary)" /> Selected Slot:
                    <strong style={{ color: 'var(--primary)', marginLeft: '4px' }}>
                      {formData.appointment_time}
                    </strong>
                  </span>
                </label>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', paddingTop: '0.5rem' }}>
                  Pick one of the available consultation slots below:
                </div>
              </div>
            </div>

            {/* Time Slot Chips */}
            <div className="form-group">
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

            {/* Reason for Visit */}
            <div className="form-group">
              <label className="form-label" htmlFor="reason">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={15} color="var(--primary)" /> Reason for Consultation
                  <span className="required">*</span>
                </span>
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                placeholder="Briefly describe your symptoms, consultation history, or health objectives..."
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
                style={{ width: '100%' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing Booking...</>
                ) : (
                  <>
                    Confirm & Book Appointment <Send size={18} />
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
