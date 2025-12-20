"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

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
    companyId: string;
    companyName: string;
}

export function CompanyActions({ companyId, companyName }: CompanyActionsProps) {
    const t = useTranslations('companyDetail');
    const router = useRouter();
    const deleteCompanyMutation = useDeleteCompany();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEdit = () => {
        router.push(`/practice/tanstack/company/${companyId}/edit`);
    };

    const handleDelete = () => {
        deleteCompanyMutation.mutate(companyId);
        setIsDialogOpen(false);
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={deleteCompanyMutation.isPending}
            >
                <Pencil className="mr-2 h-4 w-4" />
                {t('edit')}
            </Button>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleteCompanyMutation.isPending}
                    >
                        {deleteCompanyMutation.isPending ? (
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
                            {t('deleteConfirmDescription', { name: companyName }).replace('{name}', companyName)}
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