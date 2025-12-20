'use client';
import type React from 'react';


export default function TanstackLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
