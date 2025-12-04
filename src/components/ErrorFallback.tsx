// Error Handling Wrapper Component
// Provides consistent error UI with retry functionality

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ErrorFallbackProps {
    error: Error | string;
    onRetry?: () => void;
    language?: 'ar' | 'en';
}

const translations = {
    ar: {
        title: 'حدث خطأ',
        retry: 'إعادة المحاولة',
        defaultMessage: 'عذراً، حدث خطأ غير متوقع',
    },
    en: {
        title: 'An Error Occurred',
        retry: 'Retry',
        defaultMessage: 'Sorry, an unexpected error occurred',
    },
};

export function ErrorFallback({ error, onRetry, language = 'ar' }: ErrorFallbackProps) {
    const t = translations[language];
    const errorMessage = typeof error === 'string' ? error : error.message;

    return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {t.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {errorMessage || t.defaultMessage}
                </p>

                {onRetry && (
                    <Button
                        onClick={onRetry}
                        className="bg-[#FB5E7A] hover:bg-[#e5536e]"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t.retry}
                    </Button>
                )}
            </Card>
        </div>
    );
}

// Empty State Component
interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                {icon && (
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {icon}
                    </div>
                )}

                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {title}
                </h3>

                {description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {description}
                    </p>
                )}

                {action && (
                    <Button
                        onClick={action.onClick}
                        className="bg-[#FB5E7A] hover:bg-[#e5536e]"
                    >
                        {action.label}
                    </Button>
                )}
            </div>
        </div>
    );
}
