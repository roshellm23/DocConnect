import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Stethoscope, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Admin signed out.', 'info');
    navigate('/login');
  };

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/appointments',
      label: 'Appointments',
      icon: Calendar,
    },
    {
      to: '/admin/patients',
      label: 'Patients',
      icon: Users,
    },
    {
      to: '/admin/doctors',
      label: 'Doctors Roster',
      icon: Stethoscope,
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--slate-200)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.5rem 1.25rem',
            borderBottom: '1px solid var(--slate-100)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #0d9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0, lineHeight: 1.1 }}>
              DocConnect
            </h2>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#0284c7',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Admin Workspace
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--slate-400)',
              letterSpacing: '0.08em',
              padding: '0.25rem 0.75rem',
              marginBottom: '0.25rem',
            }}
          >
            Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#0284c7' : 'var(--slate-600)',
                  backgroundColor: isActive ? '#e0f2fe' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid #0284c7' : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Icon size={18} color={isActive ? '#0284c7' : 'var(--slate-500)'} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} color="#0284c7" />}
              </Link>
            );
          })}

          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--slate-400)',
              letterSpacing: '0.08em',
              padding: '0.75rem 0.75rem 0.25rem',
              marginTop: '0.75rem',
            }}
          >
            Patient Portal
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--slate-600)',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            <ExternalLink size={17} color="var(--slate-500)" />
            <span>Public Site</span>
          </Link>
        </div>

        {/* User Card at Bottom */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--slate-100)',
            backgroundColor: 'var(--slate-50)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              AD
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-900)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.full_name || 'System Admin'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-danger-outline btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={14} /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: '64px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
            System Environment: <span style={{ color: '#16a34a', fontWeight: 600 }}>● Online & Healthy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                fontWeight: 600,
              }}
            >
              Role: System Administrator
            </span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
