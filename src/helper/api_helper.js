import axios from 'axios';

const api_helper = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api_helper.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('pg_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle logout on 401
api_helper.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('pg_auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api_helper;
