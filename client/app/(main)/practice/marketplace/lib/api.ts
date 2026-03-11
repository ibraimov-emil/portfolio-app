import axios from 'axios';
import { getCookie } from '@/lib/cookies';

export const api = axios.create({
    baseURL: 'http://localhost:8000/api/marketplace/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getCookie('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
