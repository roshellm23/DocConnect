import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DoctorsPage from './pages/DoctorsPage';

// Patient Pages (protected)
import PatientDashboardPage from './pages/PatientDashboardPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import AppointmentsListPage from './pages/AppointmentsListPage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages (admin-only)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';
import AdminPatientsPage from './pages/admin/AdminPatientsPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-demo.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public layout (Navbar + Footer) */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="doctors" element={<DoctorsPage />} />

                {/* Protected Patient Routes */}
                <Route
                  path="dashboard"
                  element={<ProtectedRoute><PatientDashboardPage /></ProtectedRoute>}
                />
                <Route
                  path="book"
                  element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>}
                />
                <Route
                  path="appointments"
                  element={<ProtectedRoute><AppointmentsListPage /></ProtectedRoute>}
                />
                <Route
                  path="appointments/:id"
                  element={<ProtectedRoute><AppointmentDetailsPage /></ProtectedRoute>}
                />
                <Route
                  path="profile"
                  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>

              {/* Admin Layout (sidebar-based) */}
              <Route
                path="/admin"
                element={<AdminRoute><AdminLayout /></AdminRoute>}
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="appointments" element={<AdminAppointmentsPage />} />
                <Route path="patients" element={<AdminPatientsPage />} />
                <Route path="doctors" element={<DoctorsPage adminView />} />
              </Route>
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
