import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  PlusCircle, 
  ArrowRight, 
  CalendarCheck, 
  CalendarX, 
  CheckCircle2, 
  LayoutDashboard, 
  User, 
  AlertCircle,
  Activity,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAppointments } from '../services/api';
import { formatDate } from '../utils/formatters';
import StatusBadge from '../components/StatusBadge';

const PatientDashboardPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAppointments();
        setAppointments(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load your appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Compute statistics
  const scheduledCount = appointments.filter((a) => a.status === 'scheduled' || a.status === 'confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;

  // Find next upcoming appointment
  const upcomingAppointments = appointments
    .filter((a) => a.status === 'scheduled' || a.status === 'confirmed')
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

  const nextAppointment = upcomingAppointments[0];
  const recentAppointments = appointments.slice(0, 4);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Personalized Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ maxWidth: '600px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            <HeartPulse size={15} /> Patient Portal
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>
            {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Patient'}!
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0, lineHeight: 1.5 }}>
            Welcome to your healthcare dashboard. Track upcoming medical visits, review past consultations, and coordinate specialist care.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/book"
            className="btn"
            style={{
              backgroundColor: '#ffffff',
              color: '#0d9488',
              fontWeight: 700,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            <PlusCircle size={17} /> Schedule Consultation
          </Link>
          <Link
            to="/doctors"
            className="btn"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Stethoscope size={17} /> Browse Specialists
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Statistics Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarCheck size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>
              {loading ? '...' : scheduledCount}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem', fontWeight: 600 }}>
              Upcoming Consultations
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>
              {loading ? '...' : completedCount}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem', fontWeight: 600 }}>
              Completed Visits
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarX size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>
              {loading ? '...' : cancelledCount}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem', fontWeight: 600 }}>
              Cancelled Appointments
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#ccfbf1',
              color: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>
              {loading ? '...' : appointments.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem', fontWeight: 600 }}>
              Total History Records
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Next Appointment Card + Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Next Scheduled Appointment Spotlight */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Upcoming Appointment Spotlight
            </h2>
            {upcomingAppointments.length > 1 && (
              <Link to="/appointments" style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
                View All ({upcomingAppointments.length})
              </Link>
            )}
          </div>

          {nextAppointment ? (
            <div
              className="card"
              style={{
                borderLeft: '4px solid #0d9488',
                padding: '1.75rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    Consultation #{nextAppointment.id}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
                    {nextAppointment.doctor_name}
                  </h3>
                </div>
                <StatusBadge status={nextAppointment.status} />
              </div>

              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                  <Calendar size={16} color="#0284c7" />
                  <span>{formatDate(nextAppointment.appointment_date)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                  <Clock size={16} color="#0284c7" />
                  <span>{nextAppointment.appointment_time}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Clinical Note / Reason:
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', margin: 0, fontStyle: 'italic' }}>
                  "{nextAppointment.reason}"
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  to={`/appointments/${nextAppointment.id}`}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  View Details & Instructions <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="card"
              style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                border: '2px dashed var(--slate-200)',
                backgroundColor: '#ffffff',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  color: 'var(--slate-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Calendar size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.35rem' }}>
                No Upcoming Appointments
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)', maxWidth: '340px', margin: '0 auto 1.5rem' }}>
                You do not have any pending healthcare appointments scheduled at this moment.
              </p>
              <Link to="/book" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> Book a Consultation Now
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions and Short Links */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
            Healthcare Shortcuts
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              to="/book"
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PlusCircle size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
                    Book New Consultation
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: 0 }}>
                    Choose doctor, date, and confirm your slot
                  </p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--slate-400)" />
            </Link>

            <Link
              to="/doctors"
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#ccfbf1',
                    color: '#0d9488',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Stethoscope size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
                    Explore Doctors Directory
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: 0 }}>
                    Review qualifications, ratings & specialties
                  </p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--slate-400)" />
            </Link>

            <Link
              to="/profile"
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    color: 'var(--slate-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
                    Patient Profile & Settings
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: 0 }}>
                    Update contact info & verify account security
                  </p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--slate-400)" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Appointments Table/List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Recent Consultation History
          </h2>
          {appointments.length > 0 && (
            <Link to="/appointments" className="btn btn-secondary btn-sm">
              View Complete List <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {recentAppointments.length > 0 ? (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-600)' }}>Doctor</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-600)' }}>Date & Time</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-600)' }}>Reason</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-600)' }}>Status</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-600)', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                        {app.doctor_name}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--slate-600)' }}>
                        <div>{formatDate(app.appointment_date)}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>{app.appointment_time}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--slate-600)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.reason}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <StatusBadge status={app.status} />
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <Link to={`/appointments/${app.id}`} className="btn btn-secondary btn-sm">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            No past consultation records recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboardPage;
