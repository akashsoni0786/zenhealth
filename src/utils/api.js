// ─── API Configuration ───
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Generic fetch wrapper with error handling ───
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('stayfit_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw { status: response.status, ...data };
  }

  return data;
};

// ─── Auth API ───
export const authAPI = {
  signup: (userData) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getMe: () => apiCall('/auth/me'),

  updateProfile: (data) => apiCall('/auth/update-profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  changePassword: (data) => apiCall('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  refreshToken: (refreshToken) => apiCall('/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  }),

  googleAuth: (data) => apiCall('/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// ─── Trainer API ───
export const trainerAPI = {
  signup: (trainerData) => apiCall('/trainer/signup', {
    method: 'POST',
    body: JSON.stringify(trainerData),
  }),

  login: (credentials) => apiCall('/trainer/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getMe: () => {
    // Use trainer token for trainer endpoints
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  updateProfile: (data) => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  changePassword: (data) => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  sendOtp: (contact) => apiCall('/trainer/send-otp', {
    method: 'POST',
    body: JSON.stringify({ contact }),
  }),

  verifyOtp: (trainerId, otp) => apiCall('/trainer/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ trainerId, otp }),
  }),

  getList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/trainer/list${query ? `?${query}` : ''}`);
  },

  getById: (id) => apiCall(`/trainer/${id}`),

  // ─── Availability ───
  getAvailability: (trainerId) => apiCall(`/trainer/availability/${trainerId}`),

  updateAvailability: (data) => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/availability', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  blockDate: (data) => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/block-date', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  unblockDate: (data) => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/unblock-date', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // ─── Documents ───
  uploadDocument: (data) => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/documents', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getDocuments: () => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/documents', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  deleteDocument: (docId) => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall(`/trainer/documents/${docId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // ─── Bank Details ───
  submitBankDetails: (data) => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/bank-details', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getBankDetails: () => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/bank-details', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // ─── Notifications ───
  getNotifications: () => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall('/trainer/notifications', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  markNotificationRead: (notifId) => {
    const token = localStorage.getItem('stayfit_trainer_token');
    return apiCall(`/trainer/notifications/${notifId}/read`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

// ─── Payment API ───
export const paymentAPI = {
  createOrder: (orderData) => apiCall('/payment/create-order', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  payByCard: (data) => apiCall('/payment/pay/card', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  payByUpi: (data) => apiCall('/payment/pay/upi', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  payByNetbanking: (data) => apiCall('/payment/pay/netbanking', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getStatus: (transactionId) => apiCall(`/payment/status/${transactionId}`),

  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/payment/history${query ? `?${query}` : ''}`);
  },

  refund: (transactionId, reason) => apiCall(`/payment/refund/${transactionId}`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),

  getOrder: (orderId) => apiCall(`/payment/order/${orderId}`),

  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/payment/orders${query ? `?${query}` : ''}`);
  },
};

// ─── Chat API ───
export const chatAPI = {
  sendMessage: (data) => apiCall('/chat/message', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getSuggestions: () => apiCall('/chat/suggestions'),

  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/chat/history${query ? `?${query}` : ''}`);
  },

  deleteSession: (sessionId) => apiCall(`/chat/history/${sessionId}`, {
    method: 'DELETE',
  }),

  clearHistory: () => apiCall('/chat/history', {
    method: 'DELETE',
  }),
};

// ─── Admin API ───
export const adminAPI = {
  getTrainers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/admin/trainers${query ? `?${query}` : ''}`, {
      headers: { 'x-admin-key': 'stayfit_admin_2024' },
    });
  },

  verifyTrainer: (trainerId) => apiCall(`/admin/trainers/${trainerId}/verify`, {
    method: 'PUT',
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),

  rejectTrainer: (trainerId, reason) => apiCall(`/admin/trainers/${trainerId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),

  requestResubmission: (trainerId, remarks) => apiCall(`/admin/trainers/${trainerId}/resubmit`, {
    method: 'PUT',
    body: JSON.stringify({ remarks }),
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),

  suspendTrainer: (trainerId, reason) => apiCall(`/admin/trainers/${trainerId}/suspend`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),

  unsuspendTrainer: (trainerId) => apiCall(`/admin/trainers/${trainerId}/unsuspend`, {
    method: 'PUT',
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),

  hideTrainer: (trainerId) => apiCall(`/admin/trainers/${trainerId}/hide`, {
    method: 'PUT',
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),

  restoreTrainer: (trainerId) => apiCall(`/admin/trainers/${trainerId}/restore`, {
    method: 'PUT',
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),

  verifyBank: (trainerId) => apiCall(`/admin/trainers/${trainerId}/bank/verify`, {
    method: 'PUT',
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),

  rejectBank: (trainerId, reason) => apiCall(`/admin/trainers/${trainerId}/bank/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),

  editTrainer: (trainerId, data) => apiCall(`/admin/trainers/${trainerId}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),

  getStats: () => apiCall('/admin/stats', {
    headers: { 'x-admin-key': 'stayfit_admin_2024' },
  }),
};

// ─── Booking API ───
export const bookingAPI = {
  create: (data) => apiCall('/booking', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMyBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/booking/my${query ? `?${query}` : ''}`);
  },

  getTrainerBookings: (trainerId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/booking/trainer/${trainerId}${query ? `?${query}` : ''}`);
  },

  getById: (id) => apiCall(`/booking/${id}`),

  confirm: (id, data = {}) => apiCall(`/booking/${id}/confirm`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  complete: (id, data = {}) => apiCall(`/booking/${id}/complete`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  cancel: (id, data = {}) => apiCall(`/booking/${id}/cancel`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  reschedule: (id, data) => apiCall(`/booking/${id}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  getAvailableSlots: (trainerId, date) => apiCall(`/booking/slots/${trainerId}/${date}`),
};

// ─── Review API ───
export const reviewAPI = {
  submit: (data) => apiCall('/review', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getTrainerReviews: (trainerId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/review/trainer/${trainerId}${query ? `?${query}` : ''}`);
  },

  update: (id, data) => apiCall(`/review/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => apiCall(`/review/${id}`, {
    method: 'DELETE',
  }),

  reply: (id, reply) => apiCall(`/review/${id}/reply`, {
    method: 'PUT',
    body: JSON.stringify({ reply }),
  }),

  report: (id, reason) => apiCall(`/review/${id}/report`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
};

// ─── Check if backend is available ───
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

export default apiCall;
