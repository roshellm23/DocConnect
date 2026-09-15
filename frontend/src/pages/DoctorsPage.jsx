import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Star, 
  Clock, 
  Award, 
  Stethoscope, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Filter,
  Users
} from 'lucide-react';
import { getDoctors } from '../services/api';

const DoctorsPage = ({ adminView = false }) => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await getDoctors();
        setDoctors(data || []);
      } catch (err) {
        console.error('Failed to fetch doctors list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Unique specialties list
  const specialties = ['ALL', ...new Set(doctors.map((d) => d.specialty))];

  // Filtering
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'ALL' || doc.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className={adminView ? '' : 'container'} style={{ padding: adminView ? '0' : '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#ccfbf1',
            color: '#0f766e',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}
        >
          <Stethoscope size={14} /> Medical Specialists
        </div>
        <h1 className="page-title">
          {adminView ? 'Active Healthcare Providers' : 'Find a Certified Specialist'}
        </h1>
        <p className="page-subtitle">
          {adminView
            ? 'Credentialed medical staff available for consultation appointments.'
            : 'Book confirmed consultations with verified physicians across multiple medical departments.'}
        </p>
      </div>

      {/* Search and Filters Bar */}
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
            placeholder="Search by doctor name, specialty, or condition..."
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
            style={{ minWidth: '220px' }}
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec === 'ALL' ? 'All Medical Specialties' : spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="card" style={{ padding: '2rem', minHeight: '260px' }}>
              <div className="spinner" style={{ margin: '3rem auto' }} />
            </div>
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <Stethoscope size={42} color="var(--slate-300)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-800)' }}>
            No Specialists Found
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Try modifying your search term or clearing the medical specialty filter.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '1rem' }}
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('ALL');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Doctor Card Top Banner & Avatar */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: doc.color || '#0284c7',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                      flexShrink: 0,
                    }}
                  >
                    {doc.avatar}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0, lineHeight: 1.25 }}>
                      {doc.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '0.2rem', fontWeight: 500 }}>
                      {doc.qualification}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: '#ccfbf1',
                          color: '#0f766e',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                        }}
                      >
                        {doc.specialty.split('&')[0].trim()}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                        ● {doc.experienceLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {doc.description}
                </p>

                {/* Doctor Meta Stats */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#b45309', fontWeight: 700 }}>
                    <Star size={15} fill="#f59e0b" color="#f59e0b" />
                    <span>{doc.rating} Rating</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-600)' }}>
                    <Users size={14} color="var(--slate-400)" />
                    <span>{doc.totalPatients}+ Consults</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-600)' }}>
                    <Calendar size={14} color="#0284c7" />
                    <span>{doc.availabilityLabel}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div
                style={{
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid var(--slate-100)',
                  backgroundColor: '#ffffff',
                }}
              >
                {!adminView ? (
                  <Link
                    to={`/book?doctor=${encodeURIComponent(doc.fullTitle)}`}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Book Consultation <ArrowRight size={15} />
                  </Link>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    <span>Active Provider</span>
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>● Accepting Patients</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
