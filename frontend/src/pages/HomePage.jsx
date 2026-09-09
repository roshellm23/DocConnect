import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Stethoscope, 
  Sparkles,
  HeartPulse,
  Activity
} from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div style={{ maxWidth: '780px' }}>
            <div className="hero-badge">
              <span className="pulse" />
              <span>Modern Healthcare SaaS</span>
            </div>

            <h1 className="hero-title">
              Healthcare appointments, <span>made simple.</span>
            </h1>

            <p className="hero-subtitle">
              Find a certified specialist, choose a convenient date and time, and seamlessly manage your consultations all from one unified platform.
            </p>

            <div className="hero-cta-group">
              <Link to="/book" className="btn btn-primary btn-lg">
                Book an Appointment <ArrowRight size={18} />
              </Link>
              <Link to="/appointments" className="btn btn-secondary btn-lg">
                View Appointments
              </Link>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat">
                <h4>100%</h4>
                <p>PostgreSQL Backed</p>
              </div>
              <div className="hero-stat">
                <h4>5+</h4>
                <p>Medical Specialties</p>
              </div>
              <div className="hero-stat">
                <h4>Instant</h4>
                <p>Real-Time Booking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How DocConnect Works */}
      <section style={{ padding: '3.5rem 0', background: 'var(--white)', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Streamlined Workflow</div>
            <h2 className="section-title">How DocConnect Works</h2>
            <p className="section-desc">
              Three intuitive steps from specialist discovery to confirmed medical consultation.
            </p>
          </div>

          <div className="workflow-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Select Specialist</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                Browse our roster of certified physicians across general medicine, cardiology, dermatology, and pediatrics.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Pick Date & Slot</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                Choose a date and select an available time slot that fits seamlessly with your personal schedule.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Instant Confirmation</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                Receive instant scheduling confirmation with full appointment details stored reliably in our PostgreSQL database.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Features */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Clinical Excellence</div>
            <h2 className="section-title">Engineered for Reliable Healthcare</h2>
            <p className="section-desc">
              Designed to meet modern patient care standards with enterprise-grade reliability and cloud readiness.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <UserCheck size={24} />
              </div>
              <h3>Verified Specialists</h3>
              <p>
                Connect exclusively with credentialed physicians, cardiologists, and specialists dedicated to quality patient outcomes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Clock size={24} />
              </div>
              <h3>Real-Time Scheduling</h3>
              <p>
                Avoid double-bookings and scheduling conflicts with synchronized time slots and immediate appointment registration.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={24} />
              </div>
              <h3>Patient Privacy First</h3>
              <p>
                Your consultations and contact records are handled securely using parameterized PostgreSQL persistence.
              </p>
            </div>
          </div>

          {/* DevOps Capstone Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: 'var(--white)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                <Activity size={16} /> DevOps Capstone Pipeline Ready
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--white)', marginBottom: '0.5rem' }}>
                Person 1 Application & Git Handover
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '560px' }}>
                Modular architecture decoupled from environment specifics. Pre-configured for Jenkins CI/CD, Docker image builds, Terraform provisioning, and Kubernetes scaling.
              </p>
            </div>
            <Link to="/book" className="btn btn-primary btn-lg">
              Test Booking Flow <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
