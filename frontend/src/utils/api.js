/**
 * API Utility - Centralizes fetch interaction logic.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Standardized fetch wrapper.
 * @param {string} endpoint - The API endpoint (e.g. '/transactions').
 * @param {object} options - Fetch options (method, headers, body, etc.).
 */
export const apiFetch = async (endpoint, options = {}) => {
    const { 
        method = 'GET', 
        headers = {}, 
        body = null, 
        ...rest 
    } = options;

    const token = localStorage.getItem('auth_token');

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...headers,
        },
        ...rest,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        let data = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        }

        if (!response.ok) {
            // Handle 401 Unauthorized globally: clear token to break potential loops
            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            }

            // Handle error response from server
            const error = new Error(data?.message || `API Error: ${response.status} ${response.statusText}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

/**
 * Convenience methods for common HTTP verbs.
 */
export const api = {
    get: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'POST', body }),
    put: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'PUT', body }),
    delete: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'DELETE' }),
};

export const authService = {
    login: (credentials) => api.post('/otentikasi/masuk', credentials),
    register: (data) => api.post('/otentikasi/daftar', data),
};

export const dashboardService = {
    get: (params) => api.get('/dashboard' + (params ? `?${new URLSearchParams(params)}` : '')),
};

export const dompetService = {
    getAll: () => api.get('/dompet'),
    create: (data) => api.post('/dompet', data),
    transfer: (data) => api.put('/dompet/transfer', data),
    delete: (id) => api.delete(`/dompet?id=${id}`),
};

export const transactionService = {
    getAll: (params) => api.get('/transaksi' + (params ? `?${new URLSearchParams(params)}` : '')),
    create: (data) => api.post('/transaksi', data),
    update: (data) => api.put('/transaksi', data),
    delete: (id) => api.delete(`/transaksi?id=${id}`),
    getCategories: () => api.get('/kategori'),
};

export const emergencyFundService = {
    get: () => api.get('/dana-darurat'),
    setTarget: (data) => api.post('/dana-darurat', data),
    addSaldo: (data) => api.put('/dana-darurat/tambah', data),
};

export const targetService = {
    getAll: () => api.get('/target'),
    create: (data) => api.post('/target', data),
    addSaldo: (data) => api.put('/target/tambah', data),
    delete: (id) => api.delete(`/target?id=${id}`),
};

export const reportService = {
    get: (params) => api.get('/laporan' + (params ? `?${new URLSearchParams(params)}` : '')),
};

export default {
    base: api,
    auth: authService,
    dashboard: dashboardService,
    dompet: dompetService,
    transactions: transactionService,
    emergencyFund: emergencyFundService,
    target: targetService,
    reports: reportService,
};
