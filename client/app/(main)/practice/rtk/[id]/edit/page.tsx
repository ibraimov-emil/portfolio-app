"use client";

import { use } from "react";
import { VacancyForm } from "@/components/features/vacancy-form";
import { useGetVacancyByIdQuery, useUpdateVacancyMutation } from "@/store/api/vacancies";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { VacancyCreatePayload } from "@/types/vacancy";
import { Skeleton } from "@/components/ui/skeleton";
import type { PageParams } from "@/types/general";

export default function EditVacancyPage({ params }: PageParams) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();

    const { data: vacancyData, isLoading: isFetching } = useGetVacancyByIdQuery(id);
    const [updateVacancy, { isLoading: isUpdating }] = useUpdateVacancyMutation();

    const handleUpdate = async (payload: VacancyCreatePayload) => {
        try {
            await updateVacancy({
                id,
                payload: {
                    data: payload.data
                }
            }).unwrap();

            toast({
                title: "Success",
                description: "Vacancy updated successfully",
            });
            router.push("/practice/rtk");
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update vacancy",
                variant: "destructive",
            });
        }
    };

    if (isFetching) {
        return (
            <div className="container mx-auto py-8">
                <Skeleton className="h-[600px] w-full max-w-4xl mx-auto rounded-xl" />
            </div>
        );
    }

    if (!vacancyData?.data) {
        return (
            <div className="container mx-auto py-8 text-center text-destructive">
                Vacancy not found
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <VacancyForm
                title="Edit Vacancy"
                initialData={vacancyData.data}
                onSubmit={handleUpdate}
                isLoading={isUpdating}
            />
        </div>
    );
}
