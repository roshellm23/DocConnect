/**
 * DocConnect Frontend API Client
 * Configurable via VITE_API_URL environment variable
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic request helper with error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

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
      const networkError = new Error('Cannot connect to DocConnect server. Ensure the backend API is running on ' + API_BASE_URL);
      networkError.isNetworkError = true;
      throw networkError;
    }
    throw err;
  }
};

/**
 * Fetch all appointments
 * @returns {Promise<Array>}
 */
export const getAppointments = async () => {
  const res = await request('/appointments');
  return res.data || [];
};

/**
 * Fetch single appointment by ID
 * @param {number|string} id 
 * @returns {Promise<Object>}
 */
export const getAppointmentById = async (id) => {
  const res = await request(`/appointments/${id}`);
  return res.data;
};

/**
 * Create a new appointment
 * @param {Object} appointmentData 
 * @returns {Promise<Object>}
 */
export const createAppointment = async (appointmentData) => {
  const res = await request('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
  return res;
};

/**
 * Delete an appointment by ID
 * @param {number|string} id 
 * @returns {Promise<Object>}
 */
export const deleteAppointment = async (id) => {
  const res = await request(`/appointments/${id}`, {
    method: 'DELETE',
  });
  return res;
};

/**
 * Health check probe
 * @returns {Promise<Object>}
 */
export const checkHealth = async () => {
  return await request('/health');
};
