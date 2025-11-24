'use client';
import React from 'react';
import {ThemeProvider} from "@/components/shared/theme-provider";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Toaster} from "@/components/ui/toaster";

const queryClient = new QueryClient()

export const Providers: React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <>
            <ThemeProvider attribute="class" defaultTheme="light">
                <QueryClientProvider client={queryClient}>
                    {children}
                    <Toaster />
                </QueryClientProvider>
            </ThemeProvider>
        </>
    );
};
