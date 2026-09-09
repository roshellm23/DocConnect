import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, Calendar, Home, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkHealth } from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const [isApiOnline, setIsApiOnline] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const verifyApi = async () => {
      try {
        const res = await checkHealth();
        if (isMounted) setIsApiOnline(res.status === 'healthy');
      } catch {
        if (isMounted) setIsApiOnline(false);
      }
    };

    verifyApi();
    const interval = setInterval(verifyApi, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="container">
        <div className="nav-inner">
          <Link to="/" className="brand-logo">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#0284C7"/>
              <path d="M24 14V34M14 24H34" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
              <circle cx="33" cy="15" r="4" fill="#38BDF8"/>
            </svg>
            <span>DocConnect</span>
            <span className="brand-badge">SaaS</span>
          </Link>

          <nav className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Home size={17} /> Home
            </Link>
            <Link
              to="/appointments"
              className={`nav-link ${location.pathname === '/appointments' ? 'active' : ''}`}
            >
              <Calendar size={17} /> Appointments
            </Link>
          </nav>

          <div className="nav-actions">
            {isApiOnline !== null && (
              <span
                title={isApiOnline ? "Backend API & PostgreSQL connected" : "Backend API unreachable"}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '9999px',
                  backgroundColor: isApiOnline ? '#f0fdf4' : '#fef2f2',
                  color: isApiOnline ? '#16a34a' : '#dc2626',
                  border: `1px solid ${isApiOnline ? '#bbf7d0' : '#fecaca'}`,
                  fontWeight: 600,
                }}
              >
                {isApiOnline ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {isApiOnline ? 'API Online' : 'API Offline'}
              </span>
            )}

            <Link to="/book" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
