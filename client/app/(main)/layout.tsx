import type { Metadata } from "next";
import Navbar from "@/components/shared/navbar";

export const metadata: Metadata = {
    title: "Emil | CV | Portfolio",
    description: "Emil react and next.js developer",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
