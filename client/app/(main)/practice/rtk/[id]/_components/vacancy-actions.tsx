"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDeleteVacancyMutation } from '@/store/api/vacancies';

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useDeleteCompany } from "@/hooks/use-company-mutations";

interface CompanyActionsProps {
    vacancyId: string;
    vacancyName: string;
}

export function VacancyActions({ vacancyId, vacancyName }: CompanyActionsProps) {
    const t = useTranslations('companyDetail');
    const router = useRouter();
    const [deleteVacancy, { isLoading: isDeleting }] = useDeleteVacancyMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEdit = () => {
        router.push(`/practice/rtk/${vacancyId}/edit`);
    };

    const handleDelete = async () => {
        await deleteVacancy(vacancyId).unwrap();
        setIsDialogOpen(false);
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={isDeleting}
            >
                <Pencil className="mr-2 h-4 w-4" />
                {t('edit')}
            </Button>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        {t('delete')}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('deleteConfirmDescription', { name: vacancyName }).replace('{name}', vacancyName)}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}