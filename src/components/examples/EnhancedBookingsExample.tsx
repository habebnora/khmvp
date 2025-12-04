// Example: Enhanced Component with Error Handling and Loading States
// This is a reference implementation showing best practices

import { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { usePolling } from '@/hooks/usePolling';
import { ErrorFallback, EmptyState } from '@/components/ErrorFallback';
import { useBookingStore } from '@/stores/useBookingStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { bookingService } from '@/services/api/bookingService';
import { showError } from '@/utils/toast';
import { Calendar } from 'lucide-react';

// Skeleton component (reuse existing ones)
const BookingCardSkeleton = () => (
    <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
);

export default function EnhancedBookingsExample() {
    const { language } = useAuthStore();
    const { setBookings, bookings } = useBookingStore();

    // Fetch bookings with error handling
    const { data, isLoading, error, execute } = useApi(
        () => bookingService.getAll(),
        {
            immediate: true,
            onSuccess: (data) => {
                setBookings(data);
            },
            onError: (error) => {
                showError('فشل تحميل الحجوزات');
                console.error('Bookings fetch error:', error);
            },
        }
    );

    // Auto-refresh every 30 seconds
    usePolling(execute, {
        interval: 30000, // 30 seconds
        enabled: true,
        onError: (error) => {
            console.error('Polling error:', error);
            // Don't show toast on polling errors to avoid spam
        },
    });

    // Error state
    if (error) {
        return (
            <ErrorFallback
                error={error}
                onRetry={execute}
                language={language}
            />
        );
    }

    // Loading state
    if (isLoading && !data) {
        return (
            <div className="space-y-4 p-4">
                {[...Array(3)].map((_, i) => (
                    <BookingCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Empty state
    if (!bookings || bookings.length === 0) {
        return (
            <EmptyState
                title={language === 'ar' ? 'لا توجد حجوزات' : 'No Bookings'}
                description={language === 'ar' ? 'لم تقم بأي حجوزات بعد' : 'You haven\'t made any bookings yet'}
                icon={<Calendar className="w-8 h-8 text-gray-400" />}
                action={{
                    label: language === 'ar' ? 'ابحث عن خالة' : 'Find a Sitter',
                    onClick: () => {
                        // Navigate to search
                    },
                }}
            />
        );
    }

    // Success state - render data
    return (
        <div className="space-y-4 p-4">
            {bookings.map((booking) => (
                <div
                    key={booking.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                    <h3 className="font-semibold">{booking.serviceId}</h3>
                    <p className="text-sm text-gray-600">
                        {new Date(booking.date).toLocaleDateString('ar-EG')}
                    </p>
                    <p className="text-sm">
                        {booking.status === 'pending' && '⏳ قيد الانتظار'}
                        {booking.status === 'accepted' && '✅ مقبول'}
                        {booking.status === 'completed' && '✔️ مكتمل'}
                    </p>
                </div>
            ))}
        </div>
    );
}

/*
 * Key Features Demonstrated:
 * 
 * 1. ✅ Error Handling - ErrorFallback with retry
 * 2. ✅ Loading States - Skeleton components
 * 3. ✅ Empty States - EmptyState component
 * 4. ✅ Auto-refresh - usePolling hook
 * 5. ✅ State Management - Zustand stores
 * 6. ✅ API Integration - useApi hook
 * 7. ✅ Toast Notifications - showError
 * 8. ✅ Bilingual Support - language from store
 * 
 * This pattern should be replicated across:
 * - ClientHome
 * - ClientBookings
 * - SitterHome
 * - SitterBookings
 */
