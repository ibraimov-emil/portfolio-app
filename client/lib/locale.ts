import { type Locale, locales, defaultLocale } from '@/i18n/config';

export function setLocale(locale: Locale) {
    if (typeof window === 'undefined') return;
    
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Trigger storage event for other tabs/components
    window.dispatchEvent(new CustomEvent('locale-change', { detail: { locale } }));
    
    window.location.reload();
}

export function getLocale(): Locale {
    if (typeof window === 'undefined') return defaultLocale;
    
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
    
    if (localeCookie) {
        const locale = localeCookie.split('=')[1] as Locale;
        if (locales.includes(locale)) {
            return locale;
        }
    }
    
    return defaultLocale;
}

export async function getMessages(locale: Locale) {
    try {
        const messages = await import(`@/i18n/messages/${locale}.json`);
        return messages.default;
    } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        return {};
    }
}