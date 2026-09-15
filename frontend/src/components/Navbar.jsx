import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Stethoscope, 
  PlusCircle, 
  Users, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { addToast } = useToast();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('You have been signed out.', 'info');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="nav-inner">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#0d9488" />
              <path d="M24 14V34M14 24H34" stroke="white" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="34" cy="14" r="4.5" fill="#38bdf8" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ lineHeight: 1.1 }}>DocConnect</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--slate-500)', fontWeight: 500, letterSpacing: '0.04em' }}>
                HEALTHCARE PORTAL
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Home size={17} /> Home
            </Link>

            <Link
              to="/doctors"
              className={`nav-link ${location.pathname === '/doctors' ? 'active' : ''}`}
            >
              <Stethoscope size={17} /> Specialists
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <LayoutDashboard size={17} /> Dashboard
                </Link>
                <Link
                  to="/appointments"
                  className={`nav-link ${location.pathname.startsWith('/appointments') ? 'active' : ''}`}
                >
                  <Calendar size={17} /> My Consultations
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                >
                  <ShieldCheck size={17} /> Admin Panel
                </Link>
              </>
            )}
          </nav>

          {/* Right Actions */}
          <div className="nav-actions">
            {!isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Create Account
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {!isAdmin && (
                  <Link to="/book" className="btn btn-primary btn-sm" style={{ display: 'inline-flex' }}>
                    <PlusCircle size={15} /> Book Visit
                  </Link>
                )}

                {/* User Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'var(--white)',
                      border: '1px solid var(--slate-200)',
                      padding: '0.35rem 0.65rem 0.35rem 0.4rem',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isAdmin ? '#0284c7' : '#0d9488',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                      }}
                    >
                      {getInitials(user?.full_name)}
                    </div>
                    <div style={{ textAlign: 'left', display: 'none', minWidth: '70px', lineHeight: 1.2 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                        {user?.full_name?.split(' ')[0]}
                      </div>
                    </div>
                    <ChevronDown size={14} color="var(--slate-500)" />
                  </button>

                  {dropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        width: '210px',
                        background: 'var(--white)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--slate-200)',
                        boxShadow: 'var(--shadow-lg)',
                        padding: '0.5rem',
                        zIndex: 200,
                        animation: 'dropdownFade 0.15s ease',
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--slate-100)', marginBottom: '0.35rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                          {user?.full_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', wordBreak: 'break-all' }}>
                          {user?.email}
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: '0.25rem',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '9999px',
                            backgroundColor: isAdmin ? '#e0f2fe' : '#ccfbf1',
                            color: isAdmin ? '#0369a1' : '#0f766e',
                          }}
                        >
                          {user?.role}
                        </span>
                      </div>

                      {!isAdmin && (
                        <>
                          <Link
                            to="/dashboard"
                            className="dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <LayoutDashboard size={15} /> Patient Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            className="dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <User size={15} /> My Profile
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <LayoutDashboard size={15} /> Admin Console
                          </Link>
                          <Link
                            to="/admin/appointments"
                            className="dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Calendar size={15} /> Manage Visits
                          </Link>
                        </>
                      )}

                      <div style={{ borderTop: '1px solid var(--slate-100)', margin: '0.35rem 0' }} />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="dropdown-item"
                        style={{ color: 'var(--danger)', width: '100%', textAlign: 'left', border: 'none', background: 'none' }}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav-menu">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              <Home size={18} /> Home
            </Link>
            <Link to="/doctors" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              <Stethoscope size={18} /> Specialists
            </Link>
            {isAuthenticated && !isAdmin && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/appointments" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                  <Calendar size={18} /> My Consultations
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                  <User size={18} /> Profile
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                <ShieldCheck size={18} /> Admin Panel
              </Link>
            )}
            <div style={{ borderTop: '1px solid var(--slate-200)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
              {!isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                    Create Account
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-danger-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <LogOut size={16} /> Sign Out ({user?.full_name})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
