'use client';
import type React from 'react';
import {FiltersProvider} from "@/contexts/filters-context";

export default function ResumeLayout({
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