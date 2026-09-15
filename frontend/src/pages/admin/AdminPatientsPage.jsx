import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  RefreshCw, 
  AlertCircle,
  UserCheck,
  Activity
} from 'lucide-react';
import { getAdminUsers } from '../../services/api';
import { formatDate } from '../../utils/formatters';

const AdminPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setPatients(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch registered patients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.full_name.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      (p.phone && p.phone.toLowerCase().includes(term)) ||
      String(p.id).includes(term)
    );
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
          <h1 className="page-title" style={{ margin: 0 }}>Registered Patient Directory</h1>
          <p className="page-subtitle" style={{ margin: '0.25rem 0 0 0' }}>
            Verified accounts holding appointment histories in the DocConnect system.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fetchPatients}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'spinning' : ''} /> Refresh Patients
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Search Input */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '480px' }}>
        <div style={{ position: 'relative' }}>
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
            placeholder="Search patients by name, email, or ID..."
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <div style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>Loading patient accounts...</div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            <Users size={40} color="var(--slate-300)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-800)', fontWeight: 700 }}>
              No Patients Found
            </h3>
            <p style={{ fontSize: '0.85rem' }}>
              No patient records matched "{searchTerm}".
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Patient ID</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Patient Name</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Contact Email</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Phone</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700 }}>Registered On</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)', fontWeight: 700, textAlign: 'center' }}>Booked Visits</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: 'var(--slate-400)' }}>
                      #{p.id}
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#ccfbf1',
                            color: '#0d9488',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {p.full_name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{p.full_name}</div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--slate-600)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={14} color="var(--slate-400)" />
                        <span>{p.email}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--slate-600)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Phone size={14} color="var(--slate-400)" />
                        <span>{p.phone || '—'}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--slate-600)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} color="var(--slate-400)" />
                        <span>{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                      <span
                        style={{
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                        }}
                      >
                        {p.appointment_count || 0} visits
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPatientsPage;
