import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, appointment, isDeleting }) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-danger">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              Cancel Appointment?
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              This will permanently remove the appointment record from the database.
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'var(--slate-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            margin: '1.25rem 0',
            border: '1px solid var(--slate-200)',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ marginBottom: '0.35rem' }}>
            <strong style={{ color: 'var(--slate-800)' }}>Patient:</strong> {appointment.patient_name}
          </div>
          <div style={{ marginBottom: '0.35rem' }}>
            <strong style={{ color: 'var(--slate-800)' }}>Doctor:</strong> {appointment.doctor_name}
          </div>
          <div>
            <strong style={{ color: 'var(--slate-800)' }}>Date & Time:</strong> {appointment.appointment_date} at {appointment.appointment_time}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Keep Appointment
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Cancelling...' : 'Yes, Cancel Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
