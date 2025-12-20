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
import { useUpdateCompany } from "@/hooks/use-company-mutations";
import type { CompanyItem } from "@/types/company";

interface CompanyEditFormProps {
    company: CompanyItem;
}

export function CompanyEditForm({ company }: CompanyEditFormProps) {
    const router = useRouter();
    const updateCompanyMutation = useUpdateCompany(company.documentId);

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companyFormSchema),
        defaultValues: {
            name: company.name,
            shortDescription: company.shortDescription,
            description: company.description,
        },
    });

    const onSubmit = (values: CompanyFormValues) => {
        updateCompanyMutation.mutate(values);
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
                                    disabled={updateCompanyMutation.isPending}
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
                                    disabled={updateCompanyMutation.isPending}
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
                                    disabled={updateCompanyMutation.isPending}
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
                                    disabled={updateCompanyMutation.isPending}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        onChange(file);
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload new company logo (max 5MB, .jpg, .png, or .webp)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={updateCompanyMutation.isPending}
                        className="flex-1"
                    >
                        {updateCompanyMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Update Company
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={updateCompanyMutation.isPending}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}