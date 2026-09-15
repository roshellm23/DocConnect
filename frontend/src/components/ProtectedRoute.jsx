import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — redirects unauthenticated users to /login
 * Shows nothing while auth state is loading from localStorage
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div className="spinner" />
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save intended destination so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
