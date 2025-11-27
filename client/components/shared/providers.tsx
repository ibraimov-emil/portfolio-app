'use client';
import React from 'react';
import {ThemeProvider} from "@/components/shared/theme-provider";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Toaster} from "@/components/ui/toaster";
import {AuthProvider} from "@/contexts/auth-context";

const queryClient = new QueryClient()

export const Providers: React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <>
            <ThemeProvider attribute="class" defaultTheme="light">
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        {children}
                        <Toaster />
                    </AuthProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </>
    );
};
