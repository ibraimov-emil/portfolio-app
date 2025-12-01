'use client';

import { useState } from 'react';
import { Languages } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setLocale } from '@/lib/locale';
import type { Locale } from '@/i18n/config';

interface LanguageVersion {
    locale: string;
    name: string;
    shortDescription: string;
    description: string;
}

interface CompanyLanguageSelectorProps {
    versions: LanguageVersion[];
    currentLocale: string;
}

const languageNames: Record<string, string> = {
    en: 'English',
    ru: 'Русский'
};

const languageFlags: Record<string, string> = {
    en: '🇬🇧',
    ru: '🇷🇺'
};

export function CompanyLanguageSelector({ versions, currentLocale }: CompanyLanguageSelectorProps) {
    const t = useTranslations('companyDetail');
    const router = useRouter();

    const handleLanguageChange = (locale: string) => {
        setLocale(locale as Locale);
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Languages className="mr-2 h-4 w-4" />
                    {languageFlags[currentLocale] || '🌐'} {languageNames[currentLocale] || currentLocale.toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {versions.map((version) => (
                    <DropdownMenuItem
                        key={version.locale}
                        onClick={() => handleLanguageChange(version.locale)}
                        className={currentLocale === version.locale ? 'bg-accent' : ''}
                    >
                        <span className="mr-2">{languageFlags[version.locale] || '🌐'}</span>
                        {languageNames[version.locale] || version.locale.toUpperCase()}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
