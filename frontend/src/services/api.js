import axios from 'axios';

// ----------------------------------------------------------------
// Axios instance
// ----------------------------------------------------------------
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send cookies (refresh token) automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------------------
// Request interceptor — attach Bearer token from localStorage
// ----------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------------------------------
// Response interceptor — handle 401 globally
// ----------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      // Redirect to login (avoid redirect loop if already there)
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------
// Auth endpoints
// ----------------------------------------------------------------

/**
 * Log in with email + password credentials.
 * @param {{ email: string, password: string }} credentials
 */
export const login = (credentials) => api.post('/auth/login', credentials);

/**
 * Log out the currently authenticated user.
 */
export const logout = () => api.post('/auth/logout');

/**
 * Fetch the currently authenticated user's profile.
 */
export const getMe = () => api.get('/auth/me');

// ----------------------------------------------------------------
// Inquiry endpoints
// ----------------------------------------------------------------

/**
 * Submit a new student inquiry (public form).
 * @param {object} data  Inquiry form payload
 */
export const submitInquiry = (data) => api.post('/inquiries', data);

/**
 * Get a paginated, filtered list of inquiries.
 * @param {object} params  Query parameters (page, limit, status, search, etc.)
 */
export const getInquiries = (params) => api.get('/inquiries', { params });

/**
 * Get a single inquiry by ID.
 * @param {string} id  Inquiry document ID
 */
export const getInquiryById = (id) => api.get(`/inquiries/${id}`);

/**
 * Update the status of an inquiry.
 * @param {string} id      Inquiry document ID
 * @param {string} status  New status value ("New" | "In Progress" | "Resolved")
 */
export const updateInquiryStatus = (id, status) =>
  api.patch(`/inquiries/${id}/status`, { status });

/**
 * Get dashboard statistics (counts by status, recent inquiries, etc.).
 */
export const getStats = () => api.get('/inquiries/stats');

export default api;
