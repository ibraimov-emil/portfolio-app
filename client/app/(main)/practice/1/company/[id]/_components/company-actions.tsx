"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";

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
    companyId: number;
    companyName: string;
}

export function CompanyActions({ companyId, companyName }: CompanyActionsProps) {
    const router = useRouter();
    const deleteCompanyMutation = useDeleteCompany();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEdit = () => {
        router.push(`/practice/1/company/${companyId}/edit`);
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
                Edit
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
                        Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{companyName}</strong>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}