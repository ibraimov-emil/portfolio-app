import { Container } from "@/components/shared/container";
import { CompanyForm } from "./_components/company-form";

export default function CreateCompanyPage() {
    return (
        <Container>
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Create New Company</h1>
                    <p className="mt-2 text-muted-foreground">
                        Add a new company to your practice portfolio
                    </p>
                </div>

                <CompanyForm />
            </div>
        </Container>
    );
}
