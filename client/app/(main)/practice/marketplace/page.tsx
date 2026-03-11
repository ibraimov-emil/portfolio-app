'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from './lib/api';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Hammer, Ruler, Truck } from 'lucide-react';

// Fetch categories for the homepage
const fetchCategories = async () => {
    const { data } = await api.get('categories/');
    return data;
};

export default function MarketplaceHome() {
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-12">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl font-bold mb-4">Build Your Dream Project</h1>
                    <p className="text-lg text-blue-100 mb-8">
                        Everything you need for construction and renovation. Quality materials, expert tools, and precise calculators.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/practice/marketplace/catalog">
                            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                                Shop Now
                            </Button>
                        </Link>
                        <Link href="/practice/marketplace/calculators">
                            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                                Calculators
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </section>

            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Hammer className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg">Quality Materials</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500">Sourced from verified suppliers with quality guarantees and certificates.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <Ruler className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg">Accurate Calculators</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500">Plan your budget precisely with our advanced construction calculators.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                            <Truck className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg">Fast Delivery</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500">Reliable logistics network ensuring your materials arrive on time.</p>
                    </CardContent>
                </Card>
            </section>

            {/* Categories */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Popular Categories</h2>
                    <Link href="/practice/marketplace/catalog" className="text-blue-600 hover:underline flex items-center text-sm font-medium">
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-200 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories?.map((cat: any) => (
                            <Link key={cat.id} href={`/practice/marketplace/catalog?category=${cat.id}`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full gap-2">
                                        {/* Placeholder Icon logic or dynamic icons */}
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                                            <span className="text-xl font-bold text-slate-400">{cat.name[0]}</span>
                                        </div>
                                        <span className="font-medium text-sm">{cat.name}</span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                        {(!categories || categories.length === 0) && (
                            <div className="col-span-full text-center py-10 text-slate-500">
                                No categories found. Start by adding some in the backend!
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
