import { useState, useCallback } from 'react';
import api from '../utils/api';
import { useGlobalLoading } from '../context/LoadingContext';

// Global cache singleton (not exported)
const globalApiCache = {};

/**
 * Custom hook to interact with the API utility.
 * @returns {Array} - [execute, { data, loading, error }]
 */
const useApi = () => {
    const { startLoading, stopLoading } = useGlobalLoading();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Executes an API request.
     * @param {string} method - GET, POST, PUT, DELETE
     * @param {string} endpoint - The API endpoint
     * @param {object} body - Request body for POST/PUT
     * @param {object} options - Additional fetch options
     */
    const execute = useCallback(async (method, endpoint, body = null, options = {}) => {
        const isGet = method.toUpperCase() === 'GET';
        
        setLoading(true);
        startLoading(); // Trigger progress bar global
        setError(null);

        // Instant Cache Hit (Stale-While-Revalidate)
        if (isGet && globalApiCache[endpoint]) {
            setData(globalApiCache[endpoint]);
        }
        
        try {
            let response;
            const apiBase = api.base;
            switch (method.toUpperCase()) {
                case 'GET':
                    response = await apiBase.get(endpoint, options);
                    // Update Cache
                    globalApiCache[endpoint] = response;
                    break;
                case 'POST':
                    response = await apiBase.post(endpoint, body, options);
                    break;
                case 'PUT':
                    response = await apiBase.put(endpoint, body, options);
                    break;
                case 'DELETE':
                    response = await apiBase.delete(endpoint, options);
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }
            setData(response);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
            stopLoading(); // Matikan progress bar global
        }
    }, [startLoading, stopLoading]);

    return [execute, { data, loading, error }];
};

export default useApi;
