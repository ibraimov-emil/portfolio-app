import { axiosInstance } from "@/services/axios";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { setCookie, deleteCookie, COOKIE_NAMES } from "@/lib/cookies";

export const authService = {
    // Login
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await axiosInstance.post<AuthResponse>("/auth/local", credentials);
        
        // Store JWT token in cookie
        if (data.jwt) {
            setCookie(COOKIE_NAMES.AUTH_TOKEN, data.jwt, {
                days: 7, // Token expires in 7 days
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
        }
        
        return data;
    },

    // Register
    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const { data } = await axiosInstance.post<AuthResponse>("/auth/local/register", credentials);
        
        // Store JWT token in cookie
        if (data.jwt) {
            setCookie(COOKIE_NAMES.AUTH_TOKEN, data.jwt, {
                days: 7,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
        }
        
        return data;
    },

    // Get current user
    me: async (): Promise<User> => {
        const { data } = await axiosInstance.get<User>("/users/me", {
            withCredentials: true,
        });
        return data;
    },

    // Logout
    logout: async (): Promise<void> => {
        // Delete the auth token cookie
        deleteCookie(COOKIE_NAMES.AUTH_TOKEN);
        
        // Optionally call backend logout endpoint if it exists
        try {
            await axiosInstance.post("/auth/logout");
        } catch (error) {
            // Ignore errors from backend logout
            console.log("Backend logout endpoint not available or failed");
        }
    },
};