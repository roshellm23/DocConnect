import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  Stethoscope, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Eye
} from 'lucide-react';
import { getAdminStats, getAdminAppointments } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, appData] = await Promise.all([
        getAdminStats(),
        getAdminAppointments(),
      ]);

      setStats(statsData);
      // Take recent 6 appointments
      const list = appData?.appointments || [];
      setRecentAppointments(list.slice(0, 6));
    } catch (err) {
      setError(err.message || 'Failed to load administration analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>System Operations Overview</h1>
          <p className="page-subtitle" style={{ margin: '0.25rem 0 0 0' }}>
            Live clinical appointments, registered patient volume, and provider activity.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fetchAdminOverview}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'spinning' : ''} /> Refresh Telemetry
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Top 4 Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Total Appointments */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Appointments
            </span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>
            {loading ? '...' : (stats?.appointments?.total || 0)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '0.5rem' }}>
            All-time registered visits
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Today's Schedule
            </span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>
            {loading ? '...' : (stats?.appointments?.today || 0)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '0.5rem' }}>
            Consultations booked for today
          </div>
        </div>

        {/* Registered Patients */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Patients
            </span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#ccfbf1',
                color: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0d9488', lineHeight: 1 }}>
            {loading ? '...' : (stats?.total_patients || 0)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '0.5rem' }}>
            Registered patient accounts
          </div>
        </div>

        {/* Total Doctors */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Providers
            </span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#f3e8ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stethoscope size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed', lineHeight: 1 }}>
            {loading ? '...' : (stats?.total_doctors || 5)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '0.5rem' }}>
            Credentialed medical specialists
          </div>
        </div>
      </div>

      {/* Appointment Status Breakdown Row */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '1rem' }}>
          Consultation Status Distribution
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: 'var(--radius-md)', border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 700 }}>Scheduled</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7' }}>
              {loading ? '...' : (stats?.appointments?.scheduled || 0)}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700 }}>Confirmed</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>
              {loading ? '...' : (stats?.appointments?.confirmed || 0)}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700 }}>Completed</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#334155' }}>
              {loading ? '...' : (stats?.appointments?.completed || 0)}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 700 }}>Cancelled</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>
              {loading ? '...' : (stats?.appointments?.cancelled || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="card">
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--slate-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
              Recent Appointments
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: 0 }}>
              Latest bookings recorded in PostgreSQL
            </p>
          </div>

          <Link to="/admin/appointments" className="btn btn-secondary btn-sm">
            Manage All Appointments <ArrowRight size={14} />
          </Link>
        </div>

        {recentAppointments.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                  <th style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-500)', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-500)', fontWeight: 600 }}>Patient</th>
                  <th style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-500)', fontWeight: 600 }}>Doctor</th>
                  <th style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-500)', fontWeight: 600 }}>Date & Slot</th>
                  <th style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-500)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-500)', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-400)' }}>
                      #{app.id}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{app.patient_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{app.patient_email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                      {app.doctor_name}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{formatDate(app.appointment_date)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{app.appointment_time}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <Link to="/admin/appointments" className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.65rem' }}>
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>
            No appointments registered yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
