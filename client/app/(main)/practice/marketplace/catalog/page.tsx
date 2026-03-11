'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CatalogPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Filters state
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [categoryId, setCategoryId] = useState(searchParams.get('category') || 'all');
    const [priceRange, setPriceRange] = useState([0, 10000]);

    // Construct query params for API
    const queryParams = new URLSearchParams();
    if (search) queryParams.set('search', search);
    if (categoryId && categoryId !== 'all') queryParams.set('category', categoryId);
    queryParams.set('min_price', priceRange[0].toString());
    queryParams.set('max_price', priceRange[1].toString());

    // Fetch products
    const { data: products, isLoading: productsLoading } = useQuery({
        queryKey: ['products', search, categoryId, priceRange],
        queryFn: async () => {
            const { data } = await api.get(`products/?${queryParams.toString()}`);
            return data;
        },
    });

    // Fetch categories for filter
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('categories/');
            return data;
        },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger refetch by updating state (already hooked via useQuery keys)
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <h1 className="text-3xl font-bold">Catalog</h1>

                <div className="flex gap-2 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <Input
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-64"
                        />
                        <Button type="submit" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline">
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="py-6 space-y-6">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories?.map((cat: any) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Price Range ($0 - $10,000)</Label>
                                    <Slider
                                        min={0}
                                        max={10000}
                                        step={100}
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        className="py-4"
                                    />
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {productsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-80 bg-slate-200 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products?.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {products?.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white rounded-lg border border-dashed">
                            <p className="text-slate-500">No products found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
