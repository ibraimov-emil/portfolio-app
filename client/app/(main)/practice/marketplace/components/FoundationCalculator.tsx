'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api } from '../lib/api';
import { useCartStore } from '../store/useCartStore';

const formSchema = z.object({
    length: z.coerce.number().min(1, 'Length is required'),
    width: z.coerce.number().min(1, 'Width is required'),
    depth: z.coerce.number().min(0.1, 'Depth must be at least 0.1m'),
    width_foundation: z.coerce.number().min(0.1, 'Foundation width must be at least 0.1m'),
    concrete_grade: z.string().min(1, 'Grade is required'),
});

export function FoundationCalculator() {
    const { toast } = useToast();
    const [result, setResult] = React.useState<any>(null);
    const addItem = useCartStore((state) => state.addItem);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            length: 10,
            width: 10,
            depth: 1,
            width_foundation: 0.4,
            concrete_grade: 'M200',
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // Simple logic for MVP (Perimeter * Width * Depth)
        const perimeter = (values.length + values.width) * 2;
        const volume = perimeter * values.width_foundation * values.depth;
        const cement = volume * 300; // Approx 300kg per m3 for M200
        const sand = volume * 0.6; // Approx m3
        const gravel = volume * 0.8; // Approx m3

        const calculationResult = {
            volume: volume.toFixed(2),
            cement: cement.toFixed(0),
            sand: sand.toFixed(2),
            gravel: gravel.toFixed(2),
        };

        setResult(calculationResult);

        // Save to backend if logged in
        api.post('calculators/', {
            calculator_type: 'foundation',
            name: `Foundation ${values.length}x${values.width}`,
            input_data: values,
            result_data: calculationResult,
        }).catch(() => {
            // Ignore error if not logged in
        });

        // toast({
        //     title: "Calculation Complete",
        //     description: `Total Volume: ${volume.toFixed(2)} m³`,
        // });
    };

    const handleAddToCart = () => {
        if (!result) return;

        // Add Cement
        addItem({
            id: Date.now(),
            productId: 99901, // Mock ID for cement
            name: `Cement for ${result.volume}m³ foundation`,
            price: 50, // Mock price per bag
            quantity: Math.ceil(Number(result.cement) / 50), // 50kg bags
            type: 'product'
        });

        // Add Sand
        addItem({
            id: Date.now() + 1,
            productId: 99902, // Mock ID for sand
            name: `Sand (${result.sand}m³)`,
            price: 30, // Mock price per m3
            quantity: Math.ceil(Number(result.sand)),
            type: 'product'
        });

        toast({
            title: "Materials Added",
            description: "Calculated materials have been added to your cart.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Strip Foundation Calculator</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="length"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Length (m)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="width"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Width (m)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="depth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Depth (m)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="width_foundation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Foundation Width (m)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="concrete_grade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Concrete Grade</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select grade" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="M100">M100</SelectItem>
                                                <SelectItem value="M200">M200</SelectItem>
                                                <SelectItem value="M300">M300</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full">Calculate</Button>
                    </form>
                </Form>

                {result && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg space-y-2">
                        <h3 className="font-bold text-lg">Results</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div>Total Concrete Volume:</div>
                            <div className="font-semibold">{result.volume} m³</div>
                            <div>Cement (approx):</div>
                            <div className="font-semibold">{result.cement} kg</div>
                            <div>Sand:</div>
                            <div className="font-semibold">{result.sand} m³</div>
                            <div>Gravel:</div>
                            <div className="font-semibold">{result.gravel} m³</div>
                        </div>
                        <Button className="w-full mt-4" onClick={handleAddToCart}>
                            Add Materials to Cart
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
