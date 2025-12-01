"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { companyFormSchema, type CompanyFormValues } from "@/lib/validations/company";
import { useCreateCompany } from "@/hooks/use-company-mutations";

export function CompanyForm() {
    const router = useRouter();
    const createCompanyMutation = useCreateCompany();

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companyFormSchema),
        defaultValues: {
            name: "",
            shortDescription: "",
            description: "",
        },
    });

    const onSubmit = (values: CompanyFormValues) => {
        createCompanyMutation.mutate(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter company name"
                                    disabled={createCompanyMutation.isPending}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                The official name of the company
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief overview of the company"
                                    className="resize-none"
                                    rows={3}
                                    disabled={createCompanyMutation.isPending}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                A brief summary (10-200 characters)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Detailed description of the company"
                                    className="resize-none"
                                    rows={8}
                                    disabled={createCompanyMutation.isPending}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Detailed information about the company (20-2000 characters)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="photo"
                    render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                            <FormLabel>Company Logo</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    disabled={createCompanyMutation.isPending}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        onChange(file);
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload company logo (max 5MB, .jpg, .png, or .webp)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={createCompanyMutation.isPending}
                        className="flex-1"
                    >
                        {createCompanyMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create Company
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={createCompanyMutation.isPending}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}