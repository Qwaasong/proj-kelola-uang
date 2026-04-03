/**
 * API Utility - Centralizes fetch interaction logic.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/proj-kelola-uang/api';

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

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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

export default api;
