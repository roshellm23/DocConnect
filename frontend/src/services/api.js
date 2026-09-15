/**
 * DocConnect Frontend API Client v2
 * Configurable via VITE_API_URL environment variable
 * Supports JWT authentication via Authorization header
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get JWT token from localStorage
 */
const getToken = () => localStorage.getItem('docconnect_token');

/**
 * Generic request helper with error handling and optional auth
 */
const request = async (endpoint, options = {}, requiresAuth = false) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Attach token if available
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  } else if (requiresAuth) {
    const error = new Error('Authentication required. Please log in.');
    error.status = 401;
    throw error;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      const networkError = new Error(
        'Cannot connect to DocConnect server. Ensure the backend API is running on ' + API_BASE_URL
      );
      networkError.isNetworkError = true;
      throw networkError;
    }
    throw err;
  }
};

// ==========================================================================
// AUTH API
// ==========================================================================

export const signup = async (data) => {
  const res = await request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data; // { user, token }
};

export const login = async (data) => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data; // { user, token }
};

export const googleAuth = async (credential) => {
  const res = await request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
  return res.data; // { user, token, isNewUser }
};

export const getMe = async () => {
  const res = await request('/auth/me', {}, true);
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await request('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, true);
  return res.data;
};

// ==========================================================================
// DOCTOR API
// ==========================================================================

export const getDoctors = async () => {
  const res = await request('/doctors');
  return res.data || [];
};

export const getDoctorById = async (id) => {
  const res = await request(`/doctors/${id}`);
  return res.data;
};

// ==========================================================================
// APPOINTMENT API
// ==========================================================================

/**
 * Fetch appointments (own for patient, all for admin)
 */
export const getAppointments = async () => {
  const res = await request('/appointments', {}, true);
  return res.data || [];
};

/**
 * Fetch single appointment by ID
 */
export const getAppointmentById = async (id) => {
  const res = await request(`/appointments/${id}`, {}, true);
  return res.data;
};

/**
 * Create a new appointment (patient identity from JWT on backend)
 */
export const createAppointment = async (appointmentData) => {
  const res = await request('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  }, true);
  return res;
};

/**
 * Update appointment status (admin only)
 */
export const updateAppointmentStatus = async (id, status) => {
  const res = await request(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, true);
  return res.data;
};

/**
 * Delete / cancel an appointment
 */
export const deleteAppointment = async (id) => {
  const res = await request(`/appointments/${id}`, {
    method: 'DELETE',
  }, true);
  return res;
};

// ==========================================================================
// ADMIN API
// ==========================================================================

export const getAdminStats = async () => {
  const res = await request('/admin/stats', {}, true);
  return res.data;
};

export const getAdminAppointments = async () => {
  const res = await request('/admin/appointments', {}, true);
  return res.data;
};

export const getAdminUsers = async () => {
  const res = await request('/admin/users', {}, true);
  return res.data || [];
};

export const getAdminDoctors = async () => {
  const res = await request('/admin/doctors', {}, true);
  return res.data || [];
};

// ==========================================================================
// HEALTH CHECK
// ==========================================================================

export const checkHealth = async () => {
  return await request('/health');
};
