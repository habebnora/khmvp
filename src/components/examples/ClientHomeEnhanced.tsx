// Example: Enhanced ClientHome with Loading States and Error Handling
// This is a demonstration file showing how to integrate the new features

import { useState } from 'react';
import { Search, Star, MapPin, Clock, Bell } from 'lucide-react';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { SitterCardSkeleton, ListSkeleton } from '../ui/skeleton';
import { showError, showSuccess, getToastMessage } from '@/utils/toast';
import type { Language } from '../../App';

interface ClientHomeEnhancedProps {
    language: Language;
}

export default function ClientHomeEnhanced({ language }: ClientHomeEnhancedProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Simulated data fetching
    const fetchSitters = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate success
            showSuccess(getToastMessage('loading', language));
        } catch (err) {
            setError('Failed to load sitters');
            showError(getToastMessage('networkError', language));
        } finally {
            setIsLoading(false);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 pb-8">
                <div className="mb-6">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>

                {/* Search Skeleton */}
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />

                {/* Sitters Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SitterCardSkeleton />
                    <SitterCardSkeleton />
                    <SitterCardSkeleton />
                    <SitterCardSkeleton />
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 pb-8">
                <Card className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                {language === 'ar' ? 'حدث خطأ' : 'An Error Occurred'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {error}
                            </p>
                        </div>
                        <Button
                            onClick={fetchSitters}
                            className="bg-[#FB5E7A] hover:bg-[#e5536e]"
                        >
                            {language === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Normal State (with data)
    return (
        <div className="max-w-4xl mx-auto px-4 pb-8">
            <div className="mb-6">
                <h1 className="text-[#FB5E7A] mb-2">
                    {language === 'ar' ? 'مرحباً بك! 👋' : 'Welcome! 👋'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'ابحثي عن خالة موثوقة لأطفالك' : 'Find a trusted sitter for your children'}
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    style={{ left: language === 'ar' ? 'auto' : '12px', right: language === 'ar' ? '12px' : 'auto' }}
                />
                <Input
                    type="text"
                    placeholder={language === 'ar' ? 'ابحثي عن خالة...' : 'Search for a sitter...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 border-[#FB5E7A]"
                    style={{ paddingLeft: language === 'ar' ? '16px' : '40px', paddingRight: language === 'ar' ? '40px' : '16px' }}
                />
            </div>

            {/* Content */}
            <div className="text-center py-8">
                <p className="text-gray-500">
                    {language === 'ar' ? 'المحتوى هنا...' : 'Content here...'}
                </p>
            </div>
        </div>
    );
}
