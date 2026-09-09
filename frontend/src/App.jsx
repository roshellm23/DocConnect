import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import AppointmentsListPage from './pages/AppointmentsListPage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="book" element={<BookAppointmentPage />} />
          <Route path="appointments" element={<AppointmentsListPage />} />
          <Route path="appointments/:id" element={<AppointmentDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
