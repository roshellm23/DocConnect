import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Stethoscope, Trash2, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/formatters';

const AppointmentCard = ({ appointment, onDeleteClick }) => {
  return (
    <div className="appointment-card">
      <div>
        <div className="appointment-card-header">
          <div className="patient-info">
            <h3>{appointment.patient_name}</h3>
            <div className="patient-email">{appointment.patient_email}</div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="appointment-meta">
          <div className="meta-item">
            <Stethoscope size={16} />
            <span style={{ fontWeight: 600 }}>{appointment.doctor_name}</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <span>{formatDate(appointment.appointment_date)}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <span>{appointment.appointment_time}</span>
          </div>
        </div>

        <p className="appointment-reason" title={appointment.reason}>
          <strong>Reason:</strong> {appointment.reason}
        </p>
      </div>

      <div className="appointment-card-footer">
        <Link
          to={`/appointments/${appointment.id}`}
          className="btn btn-secondary btn-sm"
        >
          Details <ArrowRight size={14} />
        </Link>
        <button
          type="button"
          className="btn btn-danger-outline btn-sm"
          onClick={() => onDeleteClick(appointment)}
          title="Cancel and remove appointment"
        >
          <Trash2 size={14} /> Cancel
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
