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
import { getServerTranslations, createServerTranslator, getServerLocale } from "@/lib/server-locale";
import { CompanyLanguageSelector } from "./_components/company-language-selector";

export default async function CompanyDetailPage({ params }: PageParams) {
    const { id } = await params;

    try {
        const [{ data: company }, messages, locale] = await Promise.all([
            getCompanyById(id),
            getServerTranslations(),
            getServerLocale()
        ]);

        const t = createServerTranslator(messages);

        // Check if company has localizations
        const hasLocalizations = company.attributes.localizations && 
                                company.attributes.localizations.data.length > 0;

        // Get all available language versions
        const languageVersions = hasLocalizations
            ? [
                { 
                    locale: company.attributes.locale || 'en', 
                    name: company.attributes.name,
                    shortDescription: company.attributes.shortDescription,
                    description: company.attributes.description
                },
                ...company.attributes.localizations!.data.map(loc => ({
                    locale: loc.attributes.locale,
                    name: loc.attributes.name,
                    shortDescription: loc.attributes.shortDescription,
                    description: loc.attributes.description
                }))
              ]
            : null;

        // Find content matching current locale or fallback to default
        const currentContent = languageVersions
            ? languageVersions.find(v => v.locale === locale) || languageVersions[0]
            : {
                locale: company.attributes.locale || 'en',
                name: company.attributes.name,
                shortDescription: company.attributes.shortDescription,
                description: company.attributes.description
              };

        return (
            <Container className="py-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/practice/tanstack">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('companyDetail.backToCompanies')}
                        </Button>
                    </Link>
                    <CompanyActions 
                        companyId={company.id} 
                        companyName={currentContent.name}
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
                                        alt={currentContent.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <CardTitle className="text-3xl">{currentContent.name}</CardTitle>
                                        <CardDescription className="mt-2 text-base">
                                            {currentContent.shortDescription}
                                        </CardDescription>
                                    </div>
                                    {languageVersions && languageVersions.length > 1 && (
                                        <CompanyLanguageSelector 
                                            versions={languageVersions}
                                            currentLocale={currentContent.locale}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">{t('companyDetail.about')}</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {currentContent.description}
                                </p>
                            </div>
                            <div className="grid gap-4 text-sm md:grid-cols-2">
                                <div>
                                    <span className="font-medium">{t('companyDetail.created')}:</span>{" "}
                                    {new Date(company.attributes.createdAt).toLocaleDateString(locale)}
                                </div>
                                <div>
                                    <span className="font-medium">{t('companyDetail.lastUpdated')}:</span>{" "}
                                    {new Date(company.attributes.updatedAt).toLocaleDateString(locale)}
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
