"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { AuthContextType, LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { authService } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { getCookie, COOKIE_NAMES } from "@/lib/cookies";
import { getTimeUntilExpiration } from "@/lib/jwt";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Initialize auth on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Try to get current user (cookie will be sent automatically)
                const userData = await authService.me();
                setUser(userData);
            } catch (error) {
                // No valid session - user not logged in
                console.log("No active session");
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Listen for unauthorized events (401 responses)
        const handleUnauthorized = () => {
            setUser(null);
            toast({
                title: "Session expired",
                description: "Please log in again",
                variant: "destructive",
            });
        };

        // Listen for token expiration events
        const handleTokenExpired = () => {
            setUser(null);
            toast({
                title: "Session expired",
                description: "Your session has expired. Please log in again.",
                variant: "destructive",
            });
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        window.addEventListener('auth:token-expired', handleTokenExpired);
        
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
            window.removeEventListener('auth:token-expired', handleTokenExpired);
        };
    }, [toast]);

    const login = async (credentials: LoginCredentials) => {
        try {
            const { user: userData } = await authService.login(credentials);
            setUser(userData);
            toast({
                title: "Success",
                description: "Logged in successfully",
            });
        } catch (error: any) {
            console.error("Login error:", error);
            toast({
                title: "Error",
                description: error.response?.data?.error?.message || "Failed to login",
                variant: "destructive",
            });
            throw error;
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        try {
            const { user: userData } = await authService.register(credentials);
            setUser(userData);
            toast({
                title: "Success",
                description: "Account created successfully",
            });
        } catch (error: any) {
            console.error("Register error:", error);
            toast({
                title: "Error",
                description: error.response?.data?.error?.message || "Failed to register",
                variant: "destructive",
            });
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Always clear user state
            setUser(null);
            toast({
                title: "Logged out",
                description: "You have been logged out successfully",
            });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
