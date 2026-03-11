'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';

export function SupplierProducts() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch categories for form
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('categories/');
            return data;
        },
    });

    // Fetch supplier products
    const { data: products, isLoading } = useQuery({
        queryKey: ['my-products'],
        queryFn: async () => {
            const { data } = await api.get('products/my_products/');
            return data;
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`products/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-products'] });
            toast({ title: "Product deleted" });
        },
        onError: () => {
            toast({ title: "Error deleting product", variant: "destructive" });
        }
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            await api.post('products/', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-products'] });
            setIsDialogOpen(false);
            toast({ title: "Product created" });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.detail || error.response?.data?.[0] || "Error creating product";
            toast({
                title: "Error",
                description: Array.isArray(msg) ? msg[0] : msg,
                variant: "destructive"
            });
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: formData.get('price'),
            category: formData.get('category'),
            stock_quantity: formData.get('stock'),
            // slug auto-generated in backend or need handling? 
            // backend model has slug, usually handy to auto-gen in serializer or model save
            // Let's assume backend handles slug if blank, or we generate simple one
            slug: (formData.get('name') as string).toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
        };
        createMutation.mutate(data);
    };

    if (isLoading) return <div>Loading products...</div>;

    if (products?.error) {
        return <div className="p-4 text-red-500 bg-red-50 rounded">Error: {products.error}. Please ensure you are logged in as a supplier.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h3 className="text-lg font-medium">Product Management</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" name="name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select name="category" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((cat: any) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input id="price" name="price" type="number" step="0.01" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input id="stock" name="stock" type="number" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" required />
                            </div>
                            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                {createMutation.isPending ? 'Saving...' : 'Create Product'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No products found. Add your first product!
                                </TableCell>
                            </TableRow>
                        ) : (
                            products?.map((product: any) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category_name || product.category}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.stock_quantity}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(product.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
