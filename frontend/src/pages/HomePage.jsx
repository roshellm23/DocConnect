import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight,
  Stethoscope,
  CalendarCheck,
  Star,
  CheckCircle2,
  HeartPulse,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DOCTOR_OPTIONS } from '../utils/formatters';

const HomePage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{ background: 'linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <div className="hero-badge">
              <span className="pulse" />
              <span>Verified Specialist Care Network</span>
            </div>

            <h1 className="hero-title">
              Healthcare appointments, <span>made simple.</span>
            </h1>

            <p className="hero-subtitle">
              Connect with credentialed physicians, reserve verified consultation slots in real-time, and manage your complete family medical schedule from one unified, clinical-grade platform.
            </p>

            <div className="hero-cta-group">
              {isAuthenticated ? (
                <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="btn btn-primary btn-lg">
                  Access My Dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link to="/book" className="btn btn-primary btn-lg">
                    Book an Appointment <ArrowRight size={18} />
                  </Link>
                  <Link to="/signup" className="btn btn-secondary btn-lg">
                    Create Patient Account
                  </Link>
                </>
              )}
              <Link to="/doctors" className="btn btn-secondary btn-lg">
                Browse Doctors
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="hero-stats-row">
              <div className="hero-stat">
                <h4>5+</h4>
                <p>Medical Specialties</p>
              </div>
              <div className="hero-stat">
                <h4>100%</h4>
                <p>Verified Physicians</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Spotlight Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Clinical Excellence</div>
            <h2 className="section-title">Meet Our Lead Specialists</h2>
            <p className="section-desc">
              Every healthcare provider on DocConnect is credentialed with specialized training and active clinical practice.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2.5rem',
            }}
          >
            {DOCTOR_OPTIONS.slice(0, 3).map((doc, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--slate-200)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, #0d9488, #0284c7)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                      }}
                    >
                      {doc.avatar}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>
                        {doc.name.split('—')[0].trim()}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 700 }}>
                        {doc.specialty}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706', fontWeight: 700 }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" /> 4.9 Rating
                    </span>
                    <span>●</span>
                    <span>{doc.experience}</span>
                  </div>
                </div>

                <Link
                  to={`/book?doctor=${encodeURIComponent(doc.name)}`}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Book with {doc.name.split(' ')[1]} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/doctors" className="btn btn-secondary">
              View All 5 Specialists <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How DocConnect Works */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#f8fafc', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Booking Flow</div>
            <h2 className="section-title">How DocConnect Works</h2>
            <p className="section-desc">
              Three seamless steps from specialist discovery to confirmed clinical consultation.
            </p>
          </div>

          <div className="workflow-grid">
            <div className="step-card">
              <div className="step-number" style={{ backgroundColor: '#0d9488' }}>1</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Select Specialist</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                Browse our roster of certified physicians across general medicine, cardiology, dermatology, orthopedic care, and pediatrics.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number" style={{ backgroundColor: '#0284c7' }}>2</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Pick Date & Slot</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                Choose a convenient consultation date and pick from authenticated 45-minute available time slots.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number" style={{ backgroundColor: '#16a34a' }}>3</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Instant Confirmation</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                Receive instant scheduling confirmation with full appointment details stored reliably in our PostgreSQL database.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Architecture & Security</div>
            <h2 className="section-title">Engineered for Reliable Healthcare</h2>
            <p className="section-desc">
              Designed to meet modern patient care standards with enterprise-grade reliability and security.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
                <UserCheck size={24} />
              </div>
              <h3>Verified Specialists</h3>
              <p>
                Connect exclusively with credentialed physicians dedicated to quality clinical outcomes and compassionate patient communication.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                <Clock size={24} />
              </div>
              <h3>Real-Time Scheduling</h3>
              <p>
                Avoid double-bookings and scheduling conflicts with synchronized time slots and immediate appointment registration.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <ShieldCheck size={24} />
              </div>
              <h3>Patient Privacy First</h3>
              <p>
                Your consultations and contact records are handled securely using parameterized PostgreSQL persistence and bcrypt password hashing.
              </p>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2.5rem',
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              Ready to schedule your medical consultation?
            </h2>
            <p style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '560px', margin: '0 auto 1.75rem' }}>
              Sign up in seconds, pick your preferred physician, and receive an instant booking confirmation.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/book" className="btn" style={{ backgroundColor: '#ffffff', color: '#0d9488', fontWeight: 700 }}>
                Book an Appointment <ArrowRight size={16} />
              </Link>
              {!isAuthenticated && (
                <Link to="/signup" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}>
                  Register as Patient
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
