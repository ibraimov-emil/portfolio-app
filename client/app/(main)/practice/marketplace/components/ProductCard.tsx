import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useToast } from '@/hooks/use-toast';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string | number;
    category_name: string;
    image_url?: string;
    supplier?: {
        company_name: string;
    };
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const addItem = useCartStore((state) => state.addItem);
    const { toast } = useToast();

    const handleAddToCart = () => {
        addItem({
            id: Date.now(), // Unique ID for cart item
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            type: 'product',
        });
        toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
        });
    };

    return (
        <Card className="flex flex-col h-full">
            <div className="aspect-video relative bg-slate-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
                ) : (
                    <span className="text-slate-400 text-3xl font-bold">{product.name[0]}</span>
                )}
                {product.supplier && (
                    <Badge className="absolute top-2 right-2 bg-white/90 text-slate-800 hover:bg-white">{product.supplier.company_name}</Badge>
                )}
            </div>
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">{product.category_name}</p>
                        <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
                <p className="text-sm text-slate-600 line-clamp-3">{product.description}</p>
            </CardContent>
            <CardFooter className="p-4 border-t flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">${Number(product.price).toFixed(2)}</span>
                <Button size="sm" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add
                </Button>
            </CardFooter>
        </Card>
    );
};
