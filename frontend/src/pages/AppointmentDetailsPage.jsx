import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Stethoscope, 
  FileText, 
  Trash2, 
  ArrowLeft, 
  AlertCircle,
  CheckCircle2,
  Database
} from 'lucide-react';
import { getAppointmentById, deleteAppointment } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { formatDate } from '../utils/formatters';

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAppointmentById(id);
        setAppointment(data);
      } catch (err) {
        setError(err.message || `Unable to locate appointment #${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAppointment(id);
      navigate('/appointments', { replace: true });
    } catch (err) {
      alert(`Failed to delete appointment: ${err.message}`);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '720px' }}>
        <div className="skeleton" style={{ height: '32px', width: '40%', marginBottom: '1rem' }} />
        <div className="card" style={{ padding: '2rem' }}>
          <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '1.5rem' }} />
          <div className="skeleton" style={{ height: '120px', width: '100%', marginBottom: '1.5rem' }} />
          <div className="skeleton" style={{ height: '40px', width: '30%' }} />
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div className="state-box">
          <div className="state-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <AlertCircle size={32} />
          </div>
          <h3 className="state-title">Appointment Not Found</h3>
          <p className="state-desc">{error || 'The requested appointment record does not exist in the database.'}</p>
          <Link to="/appointments" className="btn btn-primary btn-sm">
            <ArrowLeft size={16} /> Return to Appointments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '780px' }}>
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
          <ArrowLeft size={16} /> Back to Appointments List
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 className="page-title" style={{ margin: 0 }}>
                Appointment #{appointment.id}
              </h1>
              <StatusBadge status={appointment.status} />
            </div>
            
          </div>

          <button
            type="button"
            className="btn btn-danger-outline btn-sm"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={15} /> Cancel Appointment
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--slate-800)' }}>
            <Database size={17} color="var(--primary)" /> Consultation Record
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
            Created: {appointment.created_at ? new Date(appointment.created_at).toLocaleString() : 'N/A'}
          </span>
        </div>

        <div className="card-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            {/* Patient Card */}
            <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-400)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Patient Information
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', fontWeight: 700, fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                <User size={16} color="var(--primary)" /> {appointment.patient_name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                <Mail size={15} color="var(--slate-400)" /> {appointment.patient_email}
              </div>
            </div>

            {/* Doctor Card */}
            <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-400)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Assigned Specialist
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', fontWeight: 700, fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                <Stethoscope size={16} color="var(--primary)" /> {appointment.doctor_name}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Medical Consultant
              </div>
            </div>
          </div>

          {/* Schedule Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              background: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={22} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>SCHEDULED DATE</div>
                <div style={{ fontWeight: 700, color: 'var(--slate-900)', fontSize: '1rem' }}>
                  {formatDate(appointment.appointment_date)}
                </div>
              </div>
            </div>

            <div style={{ width: '1px', height: '36px', background: 'var(--primary-border)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={22} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>SCHEDULED TIME</div>
                <div style={{ fontWeight: 700, color: 'var(--slate-900)', fontSize: '1rem' }}>
                  {appointment.appointment_time}
                </div>
              </div>
            </div>
          </div>

          {/* Reason Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
              <FileText size={17} color="var(--primary)" /> Reason for Consultation
            </div>
            <div
              style={{
                background: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                color: 'var(--slate-700)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}
            >
              {appointment.reason}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        appointment={appointment}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AppointmentDetailsPage;
