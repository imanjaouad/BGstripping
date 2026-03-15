import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// Ajoute automatiquement le token s'il existe dans le localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;