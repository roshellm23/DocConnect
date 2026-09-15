import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Search, 
  RotateCw, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle2, 
  CalendarX 
} from 'lucide-react';
import { getAppointments, deleteAppointment } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const AppointmentsListPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('ALL');
  
  // Modal State
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteAppointment(appointmentToDelete.id);
      setActionSuccessMessage(`Appointment #${appointmentToDelete.id} cancelled successfully.`);
      setAppointmentToDelete(null);
      // Refresh list
      await fetchAppointments();
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } catch (err) {
      alert(`Error cancelling appointment: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Appointments
  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch = 
      app.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDoctor = 
      selectedDoctorFilter === 'ALL' || app.doctor_name.includes(selectedDoctorFilter);

    return matchesSearch && matchesDoctor;
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Healthcare Appointments</h1>
          <p className="page-subtitle">
            Live consultation records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchAppointments}
            disabled={loading}
            title="Refresh from PostgreSQL"
          >
            <RotateCw size={15} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
          <Link to="/book" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> New Appointment
          </Link>
        </div>
      </div>

      {/* Action Notification */}
      {actionSuccessMessage && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <div>{actionSuccessMessage}</div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
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
            placeholder="Search by patient, email, doctor, or reason..."
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ minWidth: '200px' }}>
          <select
            className="form-select"
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
          >
            <option value="ALL">All Specialists</option>
            <option value="Ananya Mehta">Dr. Ananya Mehta</option>
            <option value="Rahul Shah">Dr. Rahul Shah</option>
            <option value="Sara Fernandes">Dr. Sara Fernandes</option>
            <option value="Vikram Rao">Dr. Vikram Rao</option>
            <option value="Neha Verma">Dr. Neha Verma</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="state-box">
          <div className="state-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <AlertCircle size={32} />
          </div>
          <h3 className="state-title">Unable to Connect</h3>
          <p className="state-desc">{error}</p>
          <button type="button" className="btn btn-primary btn-sm" onClick={fetchAppointments}>
            Retry Fetching
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="appointments-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card" style={{ padding: '1.5rem', height: '240px' }}>
              <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '1.5rem' }} />
              <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '1.5rem' }} />
              <div className="skeleton" style={{ height: '36px', width: '100%' }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && appointments.length === 0 && (
        <div className="state-box">
          <div className="state-icon">
            <CalendarX size={32} />
          </div>
          <h3 className="state-title">No Appointments Yet</h3>
          <p className="state-desc">
            No consultations are currently recorded in the database. Book your first appointment to test the complete PostgreSQL pipeline.
          </p>
          <Link to="/book" className="btn btn-primary">
            <PlusCircle size={16} /> Book Your First Appointment
          </Link>
        </div>
      )}

      {/* Search No Results */}
      {!loading && !error && appointments.length > 0 && filteredAppointments.length === 0 && (
        <div className="state-box">
          <div className="state-icon">
            <Search size={32} />
          </div>
          <h3 className="state-title">No Matches Found</h3>
          <p className="state-desc">
            No appointments match your search term "{searchTerm}". Try clearing your filters.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedDoctorFilter('ALL');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Appointments Grid */}
      {!loading && !error && filteredAppointments.length > 0 && (
        <div className="appointments-grid">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onDeleteClick={(app) => setAppointmentToDelete(app)}
            />
          ))}
        </div>
      )}

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

export default AppointmentsListPage;
