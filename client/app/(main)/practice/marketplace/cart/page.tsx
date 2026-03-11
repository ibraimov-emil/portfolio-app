'use client';

import React from 'react';
import { useCartStore } from '../store/useCartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
    const { toast } = useToast();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = React.useState(false);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const orderItems = items.map(item => ({
                product_id: item.productId,
                quantity: item.quantity
            }));

            await api.post('orders/', {
                total_amount: total(),
                shipping_address: "Default Address (User Profile)", // TODO: Get from form
                items: orderItems
            });

            toast({
                title: "Order Placed!",
                description: "Your order has been successfully created.",
            });
            clearCart();
            router.push('/practice/marketplace/orders');
        } catch (error) {
            console.error(error);
            toast({
                title: "Checkout Failed",
                description: "There was an error processing your order. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
                <Link href="/practice/marketplace/catalog">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="md:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-4 flex gap-4 items-center">
                                <div className="h-20 w-20 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded" />
                                    ) : (
                                        <span className="text-xl font-bold text-slate-400">{item.name[0]}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-slate-500 text-sm">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeItem(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Summary */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${total().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${total().toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                                {isCheckingOut ? 'Processing...' : (
                                    <>Checkout <ArrowRight className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
