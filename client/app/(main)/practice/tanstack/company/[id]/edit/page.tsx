import { notFound } from "next/navigation";
import type { PageParams } from "@/types/general";
import { Container } from "@/components/shared/container";
import { getCompanyById } from "@/services/company";
import { CompanyEditForm } from "./_components/company-edit-form";

export default async function EditCompanyPage({ params }: PageParams) {
    const { id } = await params;

    try {
        const { data: company } = await getCompanyById(id);

        return (
            <Container>
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Edit Company</h1>
                        <p className="mt-2 text-muted-foreground">
                            Update company information
                        </p>
                    </div>

                    <CompanyEditForm company={company} />
                </div>
            </Container>
        );
    } catch (error) {
        notFound();
    }
}
