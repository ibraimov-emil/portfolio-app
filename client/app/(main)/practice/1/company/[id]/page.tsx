import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { PageParams } from "@/types/general";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompanyById } from "@/services/company";
import { CompanyActions } from "./_components/company-actions";

export default async function CompanyDetailPage({ params }: PageParams) {
    const { id } = await params;

    try {
        const { data: company } = await getCompanyById(id);

        return (
            <Container className="py-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/practice/1">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Companies
                        </Button>
                    </Link>
                    <CompanyActions 
                        companyId={company.id} 
                        companyName={company.attributes.name}
                    />
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-6 md:flex-row md:items-start">
                            {company.attributes.photo?.data?.[0] && (
                                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                                    <Image
                                        src={
                                            process.env.NEXT_PUBLIC_API_URL_IMAGE +
                                            company.attributes.photo.data[0].attributes.url
                                        }
                                        alt={company.attributes.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <CardTitle className="text-3xl">{company.attributes.name}</CardTitle>
                                <CardDescription className="mt-2 text-base">
                                    {company.attributes.shortDescription}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">About</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {company.attributes.description}
                                </p>
                            </div>
                            <div className="grid gap-4 text-sm md:grid-cols-2">
                                <div>
                                    <span className="font-medium">Created:</span>{" "}
                                    {new Date(company.attributes.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="font-medium">Last Updated:</span>{" "}
                                    {new Date(company.attributes.updatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Container>
        );
    } catch (error) {
        notFound();
    }
}