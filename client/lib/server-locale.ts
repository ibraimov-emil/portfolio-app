import { cookies } from 'next/headers';
import type { Locale } from '@/i18n/config';
import { defaultLocale } from '@/i18n/config';

/**
 * Get current locale from cookies (server-side)
 */
export async function getServerLocale(): Promise<Locale> {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value as Locale;
    
    return locale || defaultLocale;
}

/**
 * Get translations for server components
 */
export async function getServerTranslations(locale?: Locale) {
    const currentLocale = locale || await getServerLocale();
    
    try {
        const messages = await import(`@/i18n/messages/${currentLocale}.json`);
        return messages.default;
    } catch (error) {
        console.error(`Failed to load messages for locale: ${currentLocale}`, error);
        const fallbackMessages = await import(`@/i18n/messages/${defaultLocale}.json`);
        return fallbackMessages.default;
    }
}

/**
 * Simple translation function for server components
 */
export function createServerTranslator(messages: any) {
    return function t(key: string, defaultValue?: string): string {
        const keys = key.split('.');
        let value = messages;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue || key;
            }
        }
        
        return typeof value === 'string' ? value : defaultValue || key;
    };
}