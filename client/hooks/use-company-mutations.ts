"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { CompanyCreatePayload, CompanyFormData } from "@/types/company";
import { createCompany, updateCompany, deleteCompany, uploadCompanyPhoto } from "@/services/company";

export function useCreateCompany() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: CompanyFormData) => {
            // Create company
            const payload: CompanyCreatePayload = {
                data: {
                    name: data.name,
                    shortDescription: data.shortDescription,
                    description: data.description,
                },
            };

            const { data: company } = await createCompany(payload);

            // Upload photo if provided
            if (data.photo) {
                await uploadCompanyPhoto(company.documentId, data.photo);
            }

            return company;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            toast({
                title: "Success",
                description: "Company created successfully",
            });
            router.push("/practice/tanstack");
            router.refresh();
        },
        onError: (error) => {
            console.error("Error creating company:", error);
            toast({
                title: "Error",
                description: "Failed to create company. Please try again.",
                variant: "destructive",
            });
        },
    });
}

export function useUpdateCompany(companyId: string) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: CompanyFormData) => {
            // Update company
            const payload: CompanyCreatePayload = {
                data: {
                    name: data.name,
                    shortDescription: data.shortDescription,
                    description: data.description,
                },
            };

            const { data: company } = await updateCompany(companyId, payload);

            // Upload new photo if provided
            if (data.photo) {
                await uploadCompanyPhoto(company.documentId, data.photo);
            }

            return company;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            queryClient.invalidateQueries({ queryKey: ["company", companyId] });
            toast({
                title: "Success",
                description: "Company updated successfully",
            });
            router.push(`/practice/tanstack/company/${companyId}`);
            router.refresh();
        },
        onError: (error) => {
            console.error("Error updating company:", error);
            toast({
                title: "Error",
                description: "Failed to update company. Please try again.",
                variant: "destructive",
            });
        },
    });
}

export function useDeleteCompany() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (companyId: string) => {
            await deleteCompany(companyId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            toast({
                title: "Success",
                description: "Company deleted successfully",
            });
            router.push("/practice/tanstack");
            router.refresh();
        },
        onError: (error) => {
            console.error("Error deleting company:", error);
            toast({
                title: "Error",
                description: "Failed to delete company. Please try again.",
                variant: "destructive",
            });
        },
    });
}