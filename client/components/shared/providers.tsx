'use client';
import React from 'react';
import {ThemeProvider} from "@/components/shared/theme-provider";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Toaster} from "@/components/ui/toaster";
import {AuthProvider} from "@/contexts/auth-context";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from '@/lib/locale';
import type {Locale} from '@/i18n/config';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';

const queryClient = new QueryClient()

export const Providers: React.FC<React.PropsWithChildren> = ({children}) => {
    const [locale, setLocale] = React.useState<Locale>('en');
    const [messages, setMessages] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadLocale = async () => {
            const currentLocale = getLocale();
            setLocale(currentLocale);
            
            const msgs = await getMessages(currentLocale);
            setMessages(msgs);
            setIsLoading(false);
        };

        loadLocale();

        // Listen for locale changes
        const handleLocaleChange = (event: CustomEvent<{ locale: Locale }>) => {
            loadLocale();
        };

        window.addEventListener('locale-change', handleLocaleChange as EventListener);
        return () => {
            window.removeEventListener('locale-change', handleLocaleChange as EventListener);
        };
    }, []);

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <ThemeProvider attribute="class" defaultTheme="light">
                    <ReduxProvider store={store}>
                        <QueryClientProvider client={queryClient}>
                            <AuthProvider>
                                {children}
                                <Toaster />
                            </AuthProvider>
                        </QueryClientProvider>
                    </ReduxProvider>
                </ThemeProvider>
            </NextIntlClientProvider>
        </>
    );
};
