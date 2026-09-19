import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createAppointment } from '../services/api';
import { DOCTOR_OPTIONS, TIME_SLOTS, formatDate } from '../utils/formatters';

/**
 * Returns short day name ('Mon', 'Tue', etc.) for a YYYY-MM-DD date string
 */
const getDayName = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Checks if a given YYYY-MM-DD date is valid for the selected doctor
 */
const isDateAvailableForDoctor = (dateStr, doctor) => {
  const todayStr = new Date().toLocaleDateString('en-CA');
  if (dateStr < todayStr) return false;
  if (!doctor || !doctor.availability) return true;
  const dayName = getDayName(dateStr);
  return doctor.availability.includes(dayName);
};

/**
 * Finds the next available date starting from today for a doctor
 */
const getNextAvailableDate = (doctor) => {
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toLocaleDateString('en-CA');
    if (isDateAvailableForDoctor(dateStr, doctor)) {
      return dateStr;
    }
  }
  return today.toLocaleDateString('en-CA');
};

/**
 * Returns the subset of TIME_SLOTS that are still bookable.
 * When the selected date is today, slots that have already passed
 * (with a 30-minute buffer) are removed.
 */
const getAvailableSlots = (selectedDate) => {
  const todayStr = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in local TZ
  if (selectedDate !== todayStr) return TIME_SLOTS;

  const now = new Date();
  return TIME_SLOTS.filter((slot) => {
    const [timePart, meridiem] = slot.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime.getTime() > now.getTime() + 30 * 60 * 1000;
  });
};

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  // Ref-based guard — prevents a double-click from firing two POST requests
  const isSubmittingRef = useRef(false);

  const doctorQueryParam = searchParams.get('doctor');

  // Form Fields State (Patient info comes from auth context!)
  const [formData, setFormData] = useState(() => {
    const initialDoc = DOCTOR_OPTIONS[0];
    const initialDate = getNextAvailableDate(initialDoc);
    return {
      doctor_name: initialDoc.name,
      appointment_date: initialDate,
      appointment_time: TIME_SLOTS[0],
      reason: '',
    };
  });

  // Current doctor details
  const selectedDoctor = DOCTOR_OPTIONS.find((doc) => doc.name === formData.doctor_name) || DOCTOR_OPTIONS[0];

  // Month & Year state for interactive calendar view
  const [viewYear, setViewYear] = useState(() => {
    return parseInt(formData.appointment_date.split('-')[0], 10);
  });
  const [viewMonth, setViewMonth] = useState(() => {
    return parseInt(formData.appointment_date.split('-')[1], 10) - 1;
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

  // Auto-reset date to next available day when doctor changes
  useEffect(() => {
    const currentDoc = DOCTOR_OPTIONS.find((doc) => doc.name === formData.doctor_name) || DOCTOR_OPTIONS[0];
    if (!isDateAvailableForDoctor(formData.appointment_date, currentDoc)) {
      const nextAvailable = getNextAvailableDate(currentDoc);
      setFormData((prev) => ({ ...prev, appointment_date: nextAvailable }));
      const [y, m] = nextAvailable.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [formData.doctor_name]); // eslint-disable-line react-hooks/exhaustive-deps

  // UI States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const todayString = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in local TZ

  // Slots available for the chosen date (past slots hidden when today is selected)
  const availableSlots = getAvailableSlots(formData.appointment_date);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctor_name) {
      newErrors.doctor_name = 'Please select a healthcare specialist';
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Please pick a consultation date';
    } else if (!isDateAvailableForDoctor(formData.appointment_date, selectedDoctor)) {
      newErrors.appointment_date = `${selectedDoctor.name.split(' — ')[0]} is unavailable on this date. Available days: ${selectedDoctor.availabilityLabel}.`;
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = 'Please select a time slot';
    } else {
      // Reject slots that have already passed
      const validSlots = getAvailableSlots(formData.appointment_date);
      if (!validSlots.includes(formData.appointment_time)) {
        newErrors.appointment_time = 'This time slot has already passed. Please choose a future slot.';
      }
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

  const handleDateSelect = (dateStr) => {
    setFormData((prev) => ({ ...prev, appointment_date: dateStr }));
    if (errors.appointment_date) {
      setErrors((prev) => ({ ...prev, appointment_date: null }));
    }
  };

  const handleTimeSelect = (slot) => {
    setFormData((prev) => ({ ...prev, appointment_time: slot }));
    if (errors.appointment_time) {
      setErrors((prev) => ({ ...prev, appointment_time: null }));
    }
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Auto-reset selected time when date changes and the slot is no longer available
  useEffect(() => {
    const slots = getAvailableSlots(formData.appointment_date);
    if (slots.length > 0 && !slots.includes(formData.appointment_time)) {
      setFormData((prev) => ({ ...prev, appointment_time: slots[0] }));
    }
  }, [formData.appointment_date]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    // ── Double-click / double-submit guard ──────────────────────────────────
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
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
      isSubmittingRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar month rendering calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const monthTitle = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    calendarDays.push(`${viewYear}-${mStr}-${dStr}`);
  }

  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            Schedule a verified specialist consultation. Days are filtered automatically by doctor availability.
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
              <strong>{formatDate(successData.appointment_date)}</strong> at <strong>{successData.appointment_time}</strong> has been secured.
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

            {/* Doctor Schedule Information Strip */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.85rem',
                color: '#334155',
              }}
            >
              <Info size={18} color="#0d9488" style={{ flexShrink: 0 }} />
              <div>
                <strong>{selectedDoctor.name.split(' — ')[0]}'s Available Days:</strong>{' '}
                <span
                  style={{
                    backgroundColor: '#ccfbf1',
                    color: '#0f766e',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    marginLeft: '0.3rem',
                  }}
                >
                  {selectedDoctor.availabilityLabel}
                </span>
              </div>
            </div>

            {/* Step 2: Interactive Doctor-Availability Calendar */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CalendarIcon size={16} color="#0d9488" /> 2. Preferred Consultation Date
                  <span className="required">*</span>
                </span>
              </label>

              {/* Custom Inline Calendar Container */}
              <div
                style={{
                  maxWidth: '380px',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.85rem 1rem',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
              >
                {/* Month Controls Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.65rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={isSubmitting}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#f8fafc',
                      padding: '0.25rem 0.45rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Previous Month"
                  >
                    <ChevronLeft size={16} color="#475569" />
                  </button>

                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                    {monthTitle}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    disabled={isSubmitting}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#f8fafc',
                      padding: '0.25rem 0.45rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Next Month"
                  >
                    <ChevronRight size={16} color="#475569" />
                  </button>
                </div>

                {/* Weekday Labels Header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '0.25rem',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    color: '#64748b',
                    marginBottom: '0.35rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {WEEKDAYS.map((wd) => {
                    const isDocAvailableDay = selectedDoctor.availability.includes(wd);
                    return (
                      <div
                        key={wd}
                        style={{
                          padding: '0.2rem 0',
                          color: isDocAvailableDay ? '#0d9488' : '#94a3b8',
                          borderBottom: isDocAvailableDay ? '2px solid #0d9488' : 'none',
                        }}
                      >
                        {wd}
                      </div>
                    );
                  })}
                </div>

                {/* Days Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '0.25rem',
                  }}
                >
                  {calendarDays.map((dateStr, idx) => {
                    if (!dateStr) {
                      return <div key={`empty-${idx}`} style={{ minHeight: '30px' }} />;
                    }

                    const dayNum = parseInt(dateStr.split('-')[2], 10);
                    const dayName = getDayName(dateStr);
                    const isAvailable = isDateAvailableForDoctor(dateStr, selectedDoctor);
                    const isSelected = formData.appointment_date === dateStr;
                    const isToday = dateStr === todayString;
                    const isPast = dateStr < todayString;

                    let titleTooltip = `${dateStr} (${dayName})`;
                    if (isPast) {
                      titleTooltip += ' — Past date';
                    } else if (!isAvailable) {
                      titleTooltip += ` — ${selectedDoctor.name.split(' — ')[0]} is not available on ${dayName}s`;
                    } else {
                      titleTooltip += ' — Click to select';
                    }

                    return (
                      <button
                        type="button"
                        key={dateStr}
                        onClick={() => isAvailable && handleDateSelect(dateStr)}
                        disabled={!isAvailable || isSubmitting}
                        title={titleTooltip}
                        style={{
                          minHeight: '30px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 800 : isToday ? 700 : 500,
                          border: isSelected
                            ? '2px solid #0d9488'
                            : isToday
                            ? '1px solid #0d9488'
                            : '1px solid #e2e8f0',
                          backgroundColor: isSelected
                            ? '#0d9488'
                            : isAvailable
                            ? '#ffffff'
                            : '#f8fafc',
                          color: isSelected
                            ? '#ffffff'
                            : isAvailable
                            ? '#1e293b'
                            : '#cbd5e1',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          opacity: isAvailable ? 1 : 0.45,
                          transition: 'all 0.15s ease-in-out',
                          boxShadow: isSelected ? '0 2px 4px rgba(13, 148, 136, 0.3)' : 'none',
                          position: 'relative',
                          padding: '0.2rem',
                        }}
                      >
                        {dayNum}
                        {isToday && !isSelected && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '2px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '3px',
                              height: '3px',
                              borderRadius: '50%',
                              backgroundColor: '#0d9488',
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Date Summary & Legend */}
                <div
                  style={{
                    marginTop: '0.65rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    fontSize: '0.78rem',
                  }}
                >
                  <div style={{ color: '#475569' }}>
                    Selected:{' '}
                    <strong style={{ color: '#0f766e', fontSize: '0.82rem' }}>
                      {formatDate(formData.appointment_date)} ({getDayName(formData.appointment_date)})
                    </strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', color: '#64748b', fontSize: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#0d9488' }} /> Available
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#cbd5e1' }} /> Off
                    </span>
                  </div>
                </div>
              </div>

              {errors.appointment_date && (
                <div className="form-error" style={{ marginTop: '0.5rem' }}>
                  <AlertCircle size={14} /> {errors.appointment_date}
                </div>
              )}
            </div>

            {/* Selected Slot & Time Slot Chips Selection */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                  <Clock size={15} color="#0d9488" style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: '-2px' }} />
                  Available Consultation Time Slots:
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1' }}>
                  Selected: {formData.appointment_time}
                </div>
              </div>

              <div className="time-slots-grid">
                {TIME_SLOTS.map((slot) => {
                  const isPast = !availableSlots.includes(slot);
                  return (
                    <button
                      type="button"
                      key={slot}
                      className={`time-slot-chip ${formData.appointment_time === slot ? 'selected' : ''} ${isPast ? 'past' : ''}`}
                      onClick={() => !isPast && handleTimeSelect(slot)}
                      disabled={isSubmitting || isPast}
                      title={isPast ? 'This slot has already passed' : slot}
                      style={isPast ? {
                        opacity: 0.35,
                        cursor: 'not-allowed',
                        textDecoration: 'line-through',
                      } : {}}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {availableSlots.length === 0 && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: 'var(--radius-md)',
                  color: '#c2410c',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem',
                }}>
                  <AlertCircle size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
                  No slots available for today. Please select another date on the calendar.
                </div>
              )}
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
