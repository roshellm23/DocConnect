import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div style={{ maxWidth: '420px' }}>
            <div className="brand-logo" style={{ marginBottom: '0.75rem' }}>
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="#0284C7"/>
                <path d="M24 14V34M14 24H34" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: '1.15rem' }}>DocConnect</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
              A reliable healthcare appointment management platform providing seamless specialist scheduling and patient care coordination.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-700)', marginBottom: '0.75rem', fontWeight: 700 }}>
                Quick Links
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                <li><Link to="/" style={{ color: 'var(--slate-600)' }}>Home</Link></li>
                <li><Link to="/doctors" style={{ color: 'var(--slate-600)' }}>Specialists</Link></li>
                <li><Link to="/appointments" style={{ color: 'var(--slate-600)' }}>Appointments</Link></li>
                <li><Link to="/book" style={{ color: 'var(--slate-600)' }}>Book Appointment</Link></li>
              </ul>
            </div>

            
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DocConnect Healthcare System. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--slate-400)' }}>
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
            <span>•</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
