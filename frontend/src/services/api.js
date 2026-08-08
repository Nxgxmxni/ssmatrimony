import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enables HTTP-Only cookies exchange
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer token from localStorage as fallback
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ss_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto-refresh access token on HTTP 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh-token') &&
      !originalRequest.url.includes('/auth/me')
    ) {
      originalRequest._retry = true;
      const storedRefreshToken = localStorage.getItem('ss_refresh_token');

      if (!storedRefreshToken) {
        localStorage.removeItem('ss_token');
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          { withCredentials: true }
        );

        if (res.data?.token) {
          localStorage.setItem('ss_token', res.data.token);
          if (res.data.refreshToken) {
            localStorage.setItem('ss_refresh_token', res.data.refreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('ss_token');
        localStorage.removeItem('ss_refresh_token');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleSignIn: (data) => api.post('/auth/google', data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  refreshToken: (data) => api.post('/auth/refresh-token', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const profileAPI = {
  getProfiles: (params) => api.get('/profiles', { params }),
  getProfileById: (id) => api.get(`/profiles/${id}`),
  updateMyProfile: (data) => api.put('/profiles/my-profile', data),
  saveDraft: (wizardStep, draftData) => api.post('/profiles/draft', { wizardStep, draftData }),
  uploadPhoto: (photoUrl) => api.post('/profiles/upload-photo', { photoUrl }),
  setPrimaryPhoto: (photoIndex) => api.put('/profiles/primary-photo', { photoIndex }),
  deletePhoto: (index) => api.delete(`/profiles/photo/${index}`),
  uploadIdDocument: (idDocumentUrl) => api.post('/profiles/upload-id', { idDocumentUrl }),
  updatePrivacy: (privacyData) => api.put('/profiles/privacy', privacyData),
  toggleShortlist: (id) => api.post(`/profiles/shortlist/${id}`),
  getFeaturedProfiles: () => api.get('/profiles/featured'),
};

export const interestAPI = {
  sendInterest: (profileId, message) => api.post(`/interests/send/${profileId}`, { message }),
  respondToInterest: (interestId, status) => api.put(`/interests/respond/${interestId}`, { status }),
  getInterests: () => api.get('/interests'),
};

export const messageAPI = {
  getConversationsList: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  sendMessage: (recipientId, content) => api.post('/messages/send', { recipientId, content }),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleVerify: (id) => api.put(`/admin/verify-profile/${id}`),
  getStories: () => api.get('/stories'),
  addStory: (data) => api.post('/stories', data),
};

export default api;
