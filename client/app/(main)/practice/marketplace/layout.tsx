"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Calculator, Package, Home, User, Truck } from 'lucide-react';
import { useCartStore } from './store/useCartStore';

export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const links = [
        { href: '/practice/marketplace', label: 'Home', icon: Home },
        { href: '/practice/marketplace/catalog', label: 'Catalog', icon: Package },
        { href: '/practice/marketplace/calculators', label: 'Calculators', icon: Calculator },
        { href: '/practice/marketplace/orders', label: 'Orders', icon: Truck },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-50 border-r p-4 hidden md:block">
                <div className="font-bold text-xl mb-6 px-4">Construction Market</div>
                <nav className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn("w-full justify-start", isActive && "bg-slate-200")}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {link.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
                    <h1 className="font-semibold text-lg">Marketplace</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/practice/marketplace/cart">
                            <Button variant="outline" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Link href="/practice/marketplace/profile">
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </header>
                <main className="p-6 bg-slate-50/50 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
