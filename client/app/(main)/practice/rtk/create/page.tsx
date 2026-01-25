"use client";

import { useRef } from "react";
import { VacancyForm } from "@/components/features/vacancy-form";
import { useCreateVacancyMutation } from "@/store/api/vacancies";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { VacancyCreatePayload } from "@/types/vacancy";

export default function CreateVacancyPage() {
    const [createVacancy, { isLoading }] = useCreateVacancyMutation();
    const { toast } = useToast();
    const router = useRouter();

    const handleCreate = async (payload: VacancyCreatePayload) => {
        try {
            await createVacancy(payload).unwrap();
            toast({
                title: "Success",
                description: "Vacancy created successfully",
            });
            router.push("/practice/rtk");
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to create vacancy",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto py-8">
            <VacancyForm
                title="Create New Vacancy"
                onSubmit={handleCreate}
                isLoading={isLoading}
            />
        </div>
    );
}
