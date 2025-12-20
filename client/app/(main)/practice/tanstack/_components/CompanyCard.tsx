'use client';

import React, { useState, useEffect } from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CompanyItem} from "@/types/company";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { getLocale } from "@/lib/locale";

interface IProps {
    company: CompanyItem;
    hasLink?: boolean;
}

const CompanyCard = ({company, hasLink = true}: IProps) => {
    const t = useTranslations('practice');
    const [currentLocale, setCurrentLocale] = useState('en');
    const [selectedContent, setSelectedContent] = useState(company);
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    useEffect(() => {
        setCurrentLocale(getLocale());
    }, []);

    const hasLocalizations = company.localizations &&
                            company.localizations.length > 0;

    const availableLanguages = hasLocalizations
        ? [
            { code: company.locale || 'en', content: company },
            ...company.localizations!.map(loc => ({
                code: loc.locale,
                content: loc
            }))
          ]
        : [{ code: company.locale || 'en', content: company }];

    const handleLanguageSelect = (langCode: string) => {
        const selected = availableLanguages.find(lang => lang.code === langCode);
        if (selected) {
            setSelectedContent(selected.content as any);
            setShowLanguageSelector(false);
        }
    };

    return (
        <Card key={company.id} className={'group cursor-pointer h-full relative'}>
            <CardHeader className="flex space-y-6">
                {company.photo && company.photo.length > 0 && <div className={'w-100 h-[300px] relative rounded-lg overflow-hidden'}>
                    <Image
                        src={process.env.NEXT_PUBLIC_API_URL_IMAGE + company.photo[0].url}
                        alt={selectedContent.name} 
                        fill={true} 
                        style={{ objectFit: 'cover' }}
                        className={'group-hover:scale-115 transition-transform duration-500 '}/>
                </div>}
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex-1">{selectedContent.name}</CardTitle>
                    {hasLocalizations && !hasLink && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowLanguageSelector(!showLanguageSelector);
                            }}
                        >
                            <Languages className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {selectedContent.shortDescription}
                </p>

                {hasLocalizations && !hasLink && showLanguageSelector && (
                    <div className="mt-4 space-y-2">
                        <p className="text-xs text-muted-foreground">{t('selectLanguage')}:</p>
                        <div className="flex flex-wrap gap-2">
                            {availableLanguages.map((lang) => (
                                <Button
                                    key={lang.code}
                                    variant={selectedContent === lang.content ? "default" : "outline"}
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleLanguageSelect(lang.code);
                                    }}
                                >
                                    {lang.code.toUpperCase()}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
export default CompanyCard
