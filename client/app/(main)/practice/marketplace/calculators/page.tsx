'use client';

import React from 'react';
import { FoundationCalculator } from '../components/FoundationCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CalculatorsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Construction Calculators</h1>
            <p className="text-slate-500">
                Plan your project with our precision calculators. Save your results and order materials directly.
            </p>

            <Tabs defaultValue="foundation" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="foundation">Foundation</TabsTrigger>
                    <TabsTrigger value="roof">Roof (Coming Soon)</TabsTrigger>
                </TabsList>
                <TabsContent value="foundation">
                    <FoundationCalculator />
                </TabsContent>
                <TabsContent value="roof">
                    <div className="p-10 text-center bg-slate-50 rounded-lg border border-dashed">
                        Roof calculator is under development.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
