/**
 * Utility functions for formatting healthcare dates, times, and statuses
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateString;
  } catch {
    return dateString;
  }
};

export const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled':
      return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', label: 'Scheduled' };
    case 'confirmed':
      return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0', label: 'Confirmed' };
    case 'completed':
      return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0', label: 'Completed' };
    case 'cancelled':
      return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca', label: 'Cancelled' };
    default:
      return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0', label: status || 'Unknown' };
  }
};

export const DOCTOR_OPTIONS = [
  {
    name: 'Dr. Ananya Mehta — General Physician',
    specialty: 'General Medicine & Family Health',
    experience: '12 yrs exp',
    avatar: 'AM',
  },
  {
    name: 'Dr. Rahul Shah — Cardiologist',
    specialty: 'Cardiovascular Health & Diagnostics',
    experience: '15 yrs exp',
    avatar: 'RS',
  },
  {
    name: 'Dr. Sara Fernandes — Dermatologist',
    specialty: 'Clinical & Cosmetic Dermatology',
    experience: '9 yrs exp',
    avatar: 'SF',
  },
  {
    name: 'Dr. Vikram Rao — Orthopedic Specialist',
    specialty: 'Joint & Musculoskeletal Care',
    experience: '14 yrs exp',
    avatar: 'VR',
  },
  {
    name: 'Dr. Neha Verma — Pediatrician',
    specialty: 'Child Health & Developmental Care',
    experience: '10 yrs exp',
    avatar: 'NV',
  },
];

export const TIME_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM',
  '05:00 PM',
];
