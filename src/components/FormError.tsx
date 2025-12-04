// Form Error Display Component
// Shows validation errors in a user-friendly way

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface FormErrorProps {
    error?: string;
    errors?: Record<string, string>;
    className?: string;
}

export function FormError({ error, errors, className }: FormErrorProps) {
    if (!error && (!errors || Object.keys(errors).length === 0)) {
        return null;
    }

    return (
        <Alert variant="destructive" className={className}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
                {error ? (
                    <p>{error}</p>
                ) : errors ? (
                    <ul className="list-disc list-inside space-y-1">
                        {Object.entries(errors).map(([field, message]) => (
                            <li key={field}>{message}</li>
                        ))}
                    </ul>
                ) : null}
            </AlertDescription>
        </Alert>
    );
}

// Field-specific error display
interface FieldErrorProps {
    error?: string;
    className?: string;
}

export function FieldError({ error, className }: FieldErrorProps) {
    if (!error) return null;

    return (
        <p className={`text-sm text-red-600 dark:text-red-400 mt-1 ${className || ''}`}>
            {error}
        </p>
    );
}
