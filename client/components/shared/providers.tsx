'use client';
import React from 'react';
import {ThemeProvider} from "@/components/shared/theme-provider";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {FiltersProvider} from "@/contexts/filters-context";

const queryClient = new QueryClient()

export const Providers: React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <>
            <ThemeProvider attribute="class" defaultTheme="light">
                <QueryClientProvider client={queryClient}>
                    <FiltersProvider>
                        {children}
                    </FiltersProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </>
    );
};
