'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function OrdersPage() {
    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const { data } = await api.get('orders/');
            return data;
        },
    });

    if (isLoading) {
        return <div className="p-8 text-center">Loading orders...</div>;
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-dashed">
                <Package className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium">No orders yet</h3>
                <p className="text-slate-500">When you purchase items, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Orders</h1>
            <div className="grid gap-4">
                {orders.map((order: any) => (
                    <Card key={order.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Order #{order.id}
                                </CardTitle>
                                <Badge variant={
                                    order.status === 'completed' ? 'default' :
                                        order.status === 'cancelled' ? 'destructive' : 'secondary'
                                }>
                                    {order.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(order.created_at), 'PPP')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {format(new Date(order.created_at), 'p')}
                                </div>
                                <div className="flex items-center gap-2 font-semibold">
                                    <DollarSign className="h-4 w-4" />
                                    ${order.total_amount}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Items</h4>
                                <ul className="space-y-2">
                                    {order.items.map((item: any) => (
                                        <li key={item.id} className="flex justify-between text-sm">
                                            <span>{item.product_name} x {item.quantity}</span>
                                            <span>${(Number(item.price_at_time) * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
