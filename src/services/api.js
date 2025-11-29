import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const hadAuthHeader = Boolean(error.config?.headers?.Authorization);
      const token = localStorage.getItem('token');
      // Only redirect for authenticated requests (with Authorization header),
      // and not in mock mode.
      if (hadAuthHeader && token !== 'mock-token') {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return; // stop further rejection handling after redirect
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout')
};

api.login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

api.verify = async () => {
  const response = await authAPI.verify();
  return response.data;
};

api.logout = async () => {
  const response = await authAPI.logout();
  return response.data;
};

// documentsAPI removed for simplified attendance system
/*
export const documentsAPI = {
  generate: (refCode, docType, preview = true) => {
    return api.post('/documents/generate', { refCode, docType, preview });
  },
  download: async (refCode, docType) => {
    const response = await api.post('/documents/generate', 
      { refCode, docType, preview: false },
      { responseType: 'blob' }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${docType}_${refCode}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  downloadSnapshot: async (refCode, docType, imageDataUrl, format = 'letter', quality = 1) => {
    const imageBlob = await (await fetch(imageDataUrl)).blob();
    const form = new FormData();
    form.append('refCode', refCode);
    form.append('docType', docType);
    form.append('format', format);
    form.append('quality', String(quality));
    form.append('file', imageBlob, 'snapshot.jpg');
    const response = await api.post('/documents/export-snapshot', form, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${docType}_${refCode}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};

*/

/* Announcements system removed */
/* export const announcementsAPI = {
  getAll: async () => {
    const response = await api.get('/announcements');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/announcements', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  }
};

// requestsAPI removed for simplified attendance system
/*
export const requestsAPI = {
  getAll: () => api.get('/requests'),
  getPending: async (since) => {
    const params = new URLSearchParams({ status: 'pending' });
    if (since) params.append('since', since);
    const response = await api.get(`/requests?${params.toString()}`);
    return response.data;
  },
  getByStatus: async (status) => {
    const response = await api.get(`/requests?status=${encodeURIComponent(status)}`);
    return response.data;
  },
  getDetails: (refCode) => api.get(`/requests/${refCode}`),
  create: async (data) => {
    const payload = {
      ...data,
      form_details: typeof data.form_details === 'string' ? data.form_details : JSON.stringify(data.form_details)
    };
    const response = await api.post('/requests', payload);
    return response.data;
  },
  approve: (refCode) => api.put(`/requests/${refCode}/approve`),
  reject: (refCode, reason) => api.put(`/requests/${refCode}/reject`, { reason }),
  update: (refCode, data) => api.put(`/requests/${refCode}`, data)
};

*/

export const attendanceAPI = {
  create: async ({ staff_id, type }) => {
    const response = await api.post('/attendance', { staff_id, type });
    return response.data;
  },
  list: async ({ from, to, limit = 100 } = {}) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (limit) params.append('limit', String(limit));
    const response = await api.get(`/attendance?${params.toString()}`);
    return response.data;
  },
  exportForStaff: async (staff_id, { from, to, format = 'csv' } = {}) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (format) params.append('format', format);
    const response = await api.get(`/attendance/export/${encodeURIComponent(staff_id)}?${params.toString()}`, { responseType: 'blob' });
    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename="?([^";]+)"?/i);
    const filename = match ? match[1] : `attendance_${staff_id}.${format === 'pdf' ? 'pdf' : 'csv'}`;
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  }
};

/* Settings system removed */
/* export const settingsAPI = {
  get: async () => {
    const response = await api.get('/settings/barangay');
    return response.data;
  },
  update: async (payload) => {
    if (payload instanceof FormData) {
      const response = await api.post('/settings/barangay', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    // default to JSON update for name-only changes
    const response = await api.put('/settings/barangay', payload);
    return response.data;
  },
  uploadSeal: async (file) => {
    const form = new FormData();
    form.append('image', file);
    const response = await api.post('/settings/barangay/seal', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  },
  deleteSeal: async () => {
    const response = await api.delete('/settings/barangay/seal');
    return response.data;
  }
};

export const staffAPI = {
  getAll: () => api.get('/staff'),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  uploadPhoto: (id, file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post(`/staff/${id}/photo`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deletePhoto: (id) => api.delete(`/staff/${id}/photo`),
  delete: (id) => api.delete(`/staff/${id}`)
};
*/
export default api;
 