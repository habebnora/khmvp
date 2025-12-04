import { toast } from 'sonner';

// Success Toast
export const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
        description,
        duration: 3000,
    });
};

// Error Toast
export const showError = (message: string, description?: string) => {
    toast.error(message, {
        description,
        duration: 4000,
    });
};

// Info Toast
export const showInfo = (message: string, description?: string) => {
    toast.info(message, {
        description,
        duration: 3000,
    });
};

// Warning Toast
export const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
        description,
        duration: 3500,
    });
};

// Loading Toast
export const showLoading = (message: string) => {
    return toast.loading(message);
};

// Promise Toast (for async operations)
export const showPromise = <T,>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string;
        error: string;
    }
) => {
    return toast.promise(promise, messages);
};

// Custom Toast with action
export const showActionToast = (
    message: string,
    actionLabel: string,
    onAction: () => void
) => {
    toast(message, {
        action: {
            label: actionLabel,
            onClick: onAction,
        },
        duration: 5000,
    });
};

// Dismiss specific toast
export const dismissToast = (toastId: string | number) => {
    toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
    toast.dismiss();
};

// Bilingual toast messages
export const toastMessages = {
    ar: {
        // Success messages
        bookingCreated: 'تم إنشاء الحجز بنجاح',
        bookingUpdated: 'تم تحديث الحجز بنجاح',
        bookingCancelled: 'تم إلغاء الحجز',
        paymentSuccess: 'تم الدفع بنجاح',
        profileUpdated: 'تم تحديث الملف الشخصي',
        reviewSubmitted: 'تم إرسال التقييم بنجاح',
        reportSent: 'تم إرسال التقرير',

        // Error messages
        bookingFailed: 'فشل إنشاء الحجز',
        paymentFailed: 'فشلت عملية الدفع',
        networkError: 'خطأ في الاتصال بالإنترنت',
        serverError: 'خطأ في الخادم، يرجى المحاولة لاحقاً',
        validationError: 'يرجى التحقق من البيانات المدخلة',
        unauthorized: 'يجب تسجيل الدخول أولاً',

        // Info messages
        loading: 'جاري التحميل...',
        processing: 'جاري المعالجة...',
        saving: 'جاري الحفظ...',

        // Warning messages
        unsavedChanges: 'لديك تغييرات غير محفوظة',
        confirmAction: 'هل أنت متأكد من هذا الإجراء؟',
    },
    en: {
        // Success messages
        bookingCreated: 'Booking created successfully',
        bookingUpdated: 'Booking updated successfully',
        bookingCancelled: 'Booking cancelled',
        paymentSuccess: 'Payment successful',
        profileUpdated: 'Profile updated',
        reviewSubmitted: 'Review submitted successfully',
        reportSent: 'Report sent',

        // Error messages
        bookingFailed: 'Failed to create booking',
        paymentFailed: 'Payment failed',
        networkError: 'Network connection error',
        serverError: 'Server error, please try again later',
        validationError: 'Please check your input',
        unauthorized: 'Please login first',

        // Info messages
        loading: 'Loading...',
        processing: 'Processing...',
        saving: 'Saving...',

        // Warning messages
        unsavedChanges: 'You have unsaved changes',
        confirmAction: 'Are you sure about this action?',
    },
};

// Helper to get message in current language
export const getToastMessage = (key: keyof typeof toastMessages.ar, language: 'ar' | 'en' = 'ar') => {
    return toastMessages[language][key];
};
