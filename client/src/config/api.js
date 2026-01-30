// API Configuration
// This file centralizes all API endpoint configurations

// Get API URL from environment variable or fallback to localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
    auth: {
        login: `${API_URL}/auth/login`,
        register: `${API_URL}/auth/register`,
        logout: `${API_URL}/auth/logout`,
    },
    progress: {
        get: `${API_URL}/progress`,
        update: `${API_URL}/progress/update`,
        delete: (algoId) => `${API_URL}/progress/${algoId}`,
    },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export default API_URL;
