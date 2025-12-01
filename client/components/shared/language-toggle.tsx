"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocale, getLocale } from "@/lib/locale";
import { type Locale, languageNames, languageFlags, locales } from "@/i18n/config";

const languages = locales.map(code => ({
    code,
    name: languageNames[code],
    flag: languageFlags[code]
}));

export function LanguageToggle() {
    const t = useTranslations('navbar');
    const [currentLocale, setCurrentLocale] = React.useState<Locale>('en');

    React.useEffect(() => {
        setCurrentLocale(getLocale());
    }, []);

    const handleLanguageChange = (locale: Locale) => {
        setLocale(locale);
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">{t('language')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={currentLocale === lang.code ? 'bg-accent' : ''}
                    >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
