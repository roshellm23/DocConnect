import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  ArrowUpDown,
  Check,
  X
} from 'lucide-react';
import { getAdminAppointments, updateAppointmentStatus, deleteAppointment } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { useToast } from '../../context/ToastContext';

const AdminAppointmentsPage = () => {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Deletion modal state
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status updating state per appointment id
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminAppointments();
      setAppointments(data?.appointments || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointment registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      addToast(`Appointment #${appointmentId} status changed to ${newStatus}.`, 'success');
      // Update local state directly for instant feedback
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      addToast(`Failed to update status: ${err.message}`, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAppointment(appointmentToDelete.id);
      addToast(`Appointment #${appointmentToDelete.id} removed from PostgreSQL.`, 'info');
      setAppointmentToDelete(null);
      await fetchAppointments();
    } catch (err) {
      addToast(`Failed to delete: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered list
  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(app.id).includes(searchTerm);

    const matchesStatus =
      statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Manage Consultations</h1>
          <p className="page-subtitle" style={{ margin: '0.25rem 0 0 0' }}>
            Review, filter, confirm, or modify patient visit statuses across all clinics.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fetchAppointments}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'spinning' : ''} /> Refresh Records
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--slate-400)',
            }}
          />
          <input
            type="text"
            placeholder="Search by ID, patient, doctor, or keyword..."
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--slate-500)" />
          <select
            className="form-select"
            style={{ minWidth: '180px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses ({appointments.length})</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Management Table */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <div style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>Loading appointment records...</div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            <Calendar size={40} color="var(--slate-300)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-800)', fontWeight: 700 }}>
              No Appointments Found
            </h3>
            <p style={{ fontSize: '0.85rem' }}>
              No bookings matched your filter query "{searchTerm}".
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Ref</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Patient Details</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Provider</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Date & Slot</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Reason</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Status Control</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: 'var(--slate-400)' }}>
                      #{app.id}
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{app.patient_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{app.patient_email}</div>
                      {app.patient_phone && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{app.patient_phone}</div>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                      {app.doctor_name}
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{formatDate(app.appointment_date)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{app.appointment_time}</div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--slate-600)', maxWidth: '200px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={app.reason}>
                        {app.reason}
                      </div>
                    </td>

                    {/* Status Select Controller */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        disabled={updatingId === app.id}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: '1px solid var(--slate-300)',
                          backgroundColor:
                            app.status === 'confirmed' ? '#dcfce7' :
                            app.status === 'completed' ? '#f1f5f9' :
                            app.status === 'cancelled' ? '#fee2e2' : '#e0f2fe',
                          color:
                            app.status === 'confirmed' ? '#15803d' :
                            app.status === 'completed' ? '#475569' :
                            app.status === 'cancelled' ? '#b91c1c' : '#0369a1',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-danger-outline btn-sm"
                        style={{ padding: '0.35rem 0.65rem' }}
                        onClick={() => setAppointmentToDelete(app)}
                        title="Cancel & Delete Appointment"
                      >
                        <Trash2 size={14} /> Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!appointmentToDelete}
        onClose={() => setAppointmentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        appointment={appointmentToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminAppointmentsPage;
