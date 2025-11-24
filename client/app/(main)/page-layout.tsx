'use client';
import type React from 'react';
import {FiltersProvider} from "@/contexts/filters-context";

export default function HomePageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <FiltersProvider>
            {children}
        </FiltersProvider>
    );
}