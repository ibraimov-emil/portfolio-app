import axios from 'axios';
import { getCookie, deleteCookie, COOKIE_NAMES } from '@/lib/cookies';
import { isTokenExpired } from '@/lib/jwt';

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add request interceptor to attach JWT token from cookie
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getCookie(COOKIE_NAMES.AUTH_TOKEN);
        
        if (token) {
            // Check if token is expired
            if (isTokenExpired(token)) {
                // Delete expired token
                deleteCookie(COOKIE_NAMES.AUTH_TOKEN);
                // Trigger logout event
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('auth:token-expired'));
                }
                return Promise.reject(new Error('Token expired'));
            }
            
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - trigger logout
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        return Promise.reject(error);
    }
);
