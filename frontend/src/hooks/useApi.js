import { useState, useCallback } from 'react';
import api from '../utils/api';

/**
 * Custom hook to interact with the API utility.
 * @returns {Array} - [execute, { data, loading, error }]
 */
const useApi = () => {
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
        setLoading(true);
        setError(null);
        
        try {
            let response;
            switch (method.toUpperCase()) {
                case 'GET':
                    response = await api.get(endpoint, options);
                    break;
                case 'POST':
                    response = await api.post(endpoint, body, options);
                    break;
                case 'PUT':
                    response = await api.put(endpoint, body, options);
                    break;
                case 'DELETE':
                    response = await api.delete(endpoint, options);
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
        }
    }, []);

    return [execute, { data, loading, error }];
};

export default useApi;
