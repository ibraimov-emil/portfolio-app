'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Package, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SupplierProducts } from './SupplierProducts';

export default function SupplierDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
                    <p className="text-slate-500">Manage your products and view sales performance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,345.00</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+25</div>
                        <p className="text-xs text-muted-foreground">+2 new this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+7</div>
                        <p className="text-xs text-muted-foreground">Requires shipping</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="products" className="w-full">
                <TabsList>
                    <TabsTrigger value="products">My Products</TabsTrigger>
                    <TabsTrigger value="orders">Received Orders</TabsTrigger>
                    <TabsTrigger value="settings">Company Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="products" className="space-y-4">
                    <SupplierProducts />
                </TabsContent>
                <TabsContent value="orders">
                    <div className="p-4 bg-white rounded-lg border">
                        <h3 className="font-medium mb-4">Incoming Orders</h3>
                        <div className="text-sm text-slate-500 text-center py-10">
                            Orders from customers will appear here.
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="settings">
                    <div className="p-4 bg-white rounded-lg border">
                        <h3 className="font-medium mb-4">Company Details</h3>
                        <div className="text-sm text-slate-500 text-center py-10">
                            Verification documents and company info form.
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}
