import api from '../utils/api';

/**
 * Example - Auth Service
 */
export const authService = {
    login: (credentials) => api.post('/login', credentials),
    register: (data) => api.post('/register', data),
    logout: () => api.post('/logout'),
};

/**
 * Example - Transaction Service
 */
export const transactionService = {
    getAll: () => api.get('/transactions'),
    getById: (id) => api.get(`/transactions/${id}`),
    create: (data) => api.post('/transactions', data),
    update: (id, data) => api.put(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
};

export default {
    auth: authService,
    transactions: transactionService,
};
