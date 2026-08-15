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
      !originalRequest.url.includes('/auth/refresh-token')
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

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markRead: () => api.put('/notifications/read-all'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  editUser: (id, data) => api.put(`/admin/users/${id}/edit`, data),
  blockUser: (id, data) => api.post(`/admin/users/${id}/block`, data),
  unblockUser: (id) => api.post(`/admin/users/${id}/unblock`),
  softDeleteUser: (id) => api.delete(`/admin/users/${id}/soft-delete`),
  restoreUser: (id) => api.post(`/admin/users/${id}/restore`),
  permanentDeleteUser: (id) => api.delete(`/admin/users/${id}/permanent`),
  resetUserPassword: (id, data) => api.post(`/admin/users/${id}/reset-password`, data),
  addAdminNote: (id, data) => api.post(`/admin/users/${id}/notes`, data),
  updateInternalTags: (id, data) => api.put(`/admin/users/${id}/tags`, data),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  toggleVerify: (id, payload) => api.put(`/admin/verify-profile/${id}`, payload),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  bulkUserAction: (action, userIds) => api.post('/admin/users/bulk-action', { action, userIds }),

  // Admin Interest Management API Endpoints
  getAdminInterests: (params) => api.get('/admin/interests', { params }),
  getAdminInterestById: (id) => api.get(`/admin/interests/${id}`),
  updateAdminInterestStatus: (id, data) => api.put(`/admin/interests/${id}/status`, data),
  addAdminInterestNote: (id, data) => api.post(`/admin/interests/${id}/notes`, data),
  convertInterestToSuccessStory: (id, data) => api.post(`/admin/interests/${id}/convert-success-story`, data),

  getVerifications: (params) => api.get('/admin/verifications', { params }),
  approveVerification: (id, note) => api.post(`/admin/verifications/${id}/approve`, { note }),
  rejectVerification: (id, reason, note) => api.post(`/admin/verifications/${id}/reject`, { reason, note }),
  reuploadVerification: (id, reason, note) => api.post(`/admin/verifications/${id}/reupload`, { reason, note }),
  removeVerificationBadge: (id) => api.post(`/admin/verifications/${id}/remove-badge`),
  managePhoto: (id, photoUrl, action) => api.post(`/admin/verifications/${id}/photo-action`, { photoUrl, action }),
  submitContact: (data) => api.post('/contact', data),
  getContacts: (params) => api.get('/admin/contacts', { params }),
  replyContact: (id, replyText) => api.post(`/admin/contacts/${id}/reply`, { replyText }),
  updateContactStatus: (id, status) => api.put(`/admin/contacts/${id}/status`, { status }),
  deleteContact: (id) => api.delete(`/admin/contacts/${id}`),
  getAdminLogs: () => api.get('/admin/logs'),
  getStories: (params) => api.get('/stories', { params }),
  getAdminStories: (params) => api.get('/stories/admin', { params }),
  getStoryById: (id) => api.get(`/stories/${id}`),
  addStory: (data) => api.post('/stories', data),
  updateStory: (id, data) => api.put(`/stories/${id}`, data),
  deleteStory: (id) => api.delete(`/stories/${id}`),
  toggleStoryStatus: (id) => api.patch(`/stories/${id}/status`),
  toggleFeatureStory: (id) => api.patch(`/stories/${id}/feature`),
  importProfiles: (data) => api.post('/admin/profiles/import', data),
  getImportedProfiles: (params) => api.get('/admin/profiles/imported', { params }),
  createAdminProfile: (data) => api.post('/admin/profiles', data),
  getImportedProfileById: (id) => api.get(`/admin/profiles/${id}`),
  updateImportedProfile: (id, data) => api.put(`/admin/profiles/${id}`, data),
  updateImportedProfileStatus: (id, status) => api.put(`/admin/profiles/${id}/status`, { status }),
  deleteImportedProfile: (id) => api.delete(`/admin/profiles/${id}`),
  getCmsPublicSection: (sectionKey) => api.get(`/cms/${sectionKey}`),
  getCmsStats: () => api.get('/admin/cms/stats'),
  getAdminCmsSection: (sectionKey) => api.get(`/admin/cms/${sectionKey}`),
  updateCmsSection: (sectionKey, data) => api.put(`/admin/cms/${sectionKey}`, data),
  rollbackCmsSection: (sectionKey, version) => api.post(`/admin/cms/${sectionKey}/rollback`, { version }),
  getReports: (params) => api.get('/admin/reports', { params }),
  getAllSettings: () => api.get('/admin/settings'),
  getSettings: (key) => api.get(`/admin/settings/${key}`),
  saveSettings: (key, data) => api.put(`/admin/settings/${key}`, { data }),
  resetSettings: (key) => api.post(`/admin/settings/${key}/reset`),
  getSystemInfo: () => api.get('/admin/settings/system-info'),
};

export default api;
