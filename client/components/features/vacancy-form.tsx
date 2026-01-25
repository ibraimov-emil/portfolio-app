"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllCompaniesQuery } from "@/store/api/companies";
import { VacancyCreatePayload, VacancyItem } from "@/types/vacancy";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const WORK_FORMATS = [
    { value: "office", label: "Office" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
];

const EMPLOYMENT_TYPES = [
    { value: "full-time", label: "Full-Time" },
    { value: "part-time", label: "Part-Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" },
];

const EXPERIENCE_LEVELS = [
    { value: "no-experience", label: "No Experience" },
    { value: "junior", label: "Junior" },
    { value: "middle", label: "Middle" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
];

const vacancySchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    salaryMin: z.coerce.number().min(0, "Salary must be positive"),
    salaryMax: z.coerce.number().min(0, "Salary must be positive"),
    location: z.string().min(2, "Location is required"),
    workFormat: z.string().min(1, "Work format is required"),
    employmentType: z.string().min(1, "Employment type is required"),
    experienceLevel: z.string().min(1, "Experience level is required"),
    contacts: z.string().min(5, "Contacts info is required"),
    company: z.string().min(1, "Company is required"),
    isActive: z.boolean().default(true),
    hot: z.boolean().default(false),
});

type VacancyFormValues = z.infer<typeof vacancySchema>;

interface VacancyFormProps {
    initialData?: VacancyItem;
    onSubmit: (data: VacancyCreatePayload) => Promise<void>;
    isLoading: boolean;
    title: string;
}

export function VacancyForm({ initialData, onSubmit, isLoading, title }: VacancyFormProps) {
    const router = useRouter();
    const { data: companiesData, isLoading: isCompaniesLoading } = useGetAllCompaniesQuery();

    const form = useForm<VacancyFormValues>({
        resolver: zodResolver(vacancySchema),
        defaultValues: {
            title: "",
            description: "",
            salaryMin: 0,
            salaryMax: 0,
            location: "",
            workFormat: "",
            employmentType: "",
            experienceLevel: "",
            contacts: "",
            company: "",
            isActive: true,
            hot: false,
        },
    });

    useEffect(() => {
        if (initialData) {
            // Extract text from blocks if possible, or just use description if it's string (legacy)
            let descriptionText = "";
            if (typeof initialData.description === 'string') {
                descriptionText = initialData.description;
            } else if (Array.isArray(initialData.description)) {
                // Very basic extraction for edit form
                descriptionText = initialData.description
                    .map((block: any) => block.children?.map((c: any) => c.text).join('') || '')
                    .join('\n\n');
            }

            // Extract contacts text if it's JSON
            let contactsText = "";
            if (typeof initialData.contacts === 'string') {
                contactsText = initialData.contacts;
            } else if (typeof initialData.contacts === 'object' && initialData.contacts !== null) {
                contactsText = (initialData.contacts as any).text || JSON.stringify(initialData.contacts);
            }

            form.reset({
                title: initialData.title,
                description: descriptionText,
                salaryMin: initialData.salaryMin,
                salaryMax: initialData.salaryMax,
                location: initialData.location,
                workFormat: initialData.workFormat,
                employmentType: initialData.employmentType,
                experienceLevel: initialData.experienceLevel,
                contacts: contactsText,
                company: initialData.company?.documentId || "",
                isActive: initialData.isActive,
                hot: initialData.hot,
            });
        }
    }, [initialData, form]);

    const handleSubmit = async (values: VacancyFormValues) => {
        try {
            // Transform description to blocks
            const descriptionBlocks = values.description.split('\n\n').map(paragraph => ({
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        text: paragraph.trim()
                    }
                ]
            })).filter(block => block.children[0].text.length > 0);

            const payload: any = {
                ...values,
                description: descriptionBlocks,
                contacts: { text: values.contacts } // sending as JSON object
            };

            await onSubmit({
                data: payload,
            });
        } catch (error) {
            console.error("Form submission error", error);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Frontend Developer" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company</FormLabel>
                                        <div className="relative">
                                            <select
                                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={isCompaniesLoading}
                                            >
                                                <option value="">Select a company</option>
                                                {companiesData?.data.map((company) => (
                                                    <option key={company.documentId} value={company.documentId}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="salaryMin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minimum Salary</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="50000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="salaryMax"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum Salary</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="80000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="New York, NY" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="workFormat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Work Format</FormLabel>
                                        <div className="relative">
                                            <select
                                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                value={field.value}
                                                onChange={field.onChange}
                                            >
                                                <option value="">Select format</option>
                                                {WORK_FORMATS.map((format) => (
                                                    <option key={format.value} value={format.value}>
                                                        {format.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="employmentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employment Type</FormLabel>
                                        <div className="relative">
                                            <select
                                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                value={field.value}
                                                onChange={field.onChange}
                                            >
                                                <option value="">Select type</option>
                                                {EMPLOYMENT_TYPES.map((type) => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="experienceLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Experience Level</FormLabel>
                                        <div className="relative">
                                            <select
                                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                value={field.value}
                                                onChange={field.onChange}
                                            >
                                                <option value="">Select level</option>
                                                {EXPERIENCE_LEVELS.map((level) => (
                                                    <option key={level.value} value={level.value}>
                                                        {level.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="contacts"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contacts</FormLabel>
                                    <FormControl>
                                        <Input placeholder="hr@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detailed job description..."
                                            className="min-h-[150px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Active</FormLabel>
                                            <FormDescription>
                                                Visible to candidates
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hot"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Hot Vacancy</FormLabel>
                                            <FormDescription>
                                                Mark as urgent/hot
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {initialData ? "Update Vacancy" : "Create Vacancy"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
