// Validation Schemas using Zod
// Comprehensive validation for all forms in the application

import { z } from 'zod';

// ==================== Authentication Schemas ====================

export const loginSchema = z.object({
    emailOrPhone: z.string()
        .min(1, 'البريد الإلكتروني أو رقم الهاتف مطلوب')
        .refine(
            (val) => {
                // Check if it's email or phone
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/; // Egyptian phone
                return emailRegex.test(val) || phoneRegex.test(val);
            },
            'يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح'
        ),
    password: z.string()
        .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
        .max(50, 'كلمة المرور طويلة جداً'),
});

export const signupSchema = z.object({
    fullName: z.string()
        .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
        .max(50, 'الاسم طويل جداً')
        .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'الاسم يجب أن يحتوي على حروف فقط'),
    email: z.string()
        .min(1, 'البريد الإلكتروني مطلوب')
        .email('البريد الإلكتروني غير صحيح'),
    phone: z.string()
        .regex(/^01[0-2,5]{1}[0-9]{8}$/, 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 01)'),
    password: z.string()
        .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
        .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
        .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير واحد على الأقل')
        .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
});

export const otpSchema = z.object({
    code: z.string()
        .length(6, 'الكود يجب أن يكون 6 أرقام')
        .regex(/^\d+$/, 'الكود يجب أن يحتوي على أرقام فقط'),
});

// ==================== Booking Schemas ====================

export const createBookingSchema = z.object({
    sitterId: z.number().positive('يرجى اختيار خالة'),
    serviceId: z.string().min(1, 'يرجى اختيار خدمة'),
    date: z.date()
        .min(new Date(), 'التاريخ يجب أن يكون في المستقبل'),
    time: z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'الوقت غير صحيح'),
    duration: z.number()
        .min(1, 'المدة يجب أن تكون ساعة واحدة على الأقل')
        .max(12, 'المدة لا يمكن أن تتجاوز 12 ساعة'),
    children: z.number()
        .min(1, 'يجب تحديد عدد الأطفال')
        .max(10, 'العدد كبير جداً'),
    location: z.string()
        .min(5, 'يرجى إدخال عنوان مفصل')
        .max(200, 'العنوان طويل جداً'),
    type: z.enum(['home', 'outside'], {
        message: 'يرجى اختيار نوع الخدمة',
    }),
    notes: z.string()
        .max(500, 'الملاحظات طويلة جداً')
        .optional(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;

// ==================== Profile Schemas ====================

export const updateProfileSchema = z.object({
    fullName: z.string()
        .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
        .max(50, 'الاسم طويل جداً'),
    email: z.string()
        .email('البريد الإلكتروني غير صحيح'),
    phone: z.string()
        .regex(/^01[0-2,5]{1}[0-9]{8}$/, 'رقم الهاتف غير صحيح'),
    bio: z.string()
        .max(500, 'النبذة طويلة جداً')
        .optional(),
    location: z.string()
        .min(3, 'الموقع مطلوب')
        .max(100, 'الموقع طويل جداً')
        .optional(),
});

export const sitterProfileSchema = updateProfileSchema.extend({
    experience: z.number()
        .min(0, 'سنوات الخبرة لا يمكن أن تكون سالبة')
        .max(50, 'سنوات الخبرة كبيرة جداً'),
    languages: z.array(z.string())
        .min(1, 'يجب اختيار لغة واحدة على الأقل'),
    specialties: z.array(z.string())
        .min(1, 'يجب اختيار تخصص واحد على الأقل'),
    availabilityType: z.enum(['home', 'outside', 'both']),
    hourlyRate: z.number()
        .min(20, 'الأجر بالساعة يجب أن يكون 20 جنيه على الأقل')
        .max(500, 'الأجر بالساعة مرتفع جداً'),
});

// ==================== Payment Schemas ====================

export const cardPaymentSchema = z.object({
    cardNumber: z.string()
        .regex(/^\d{16}$/, 'رقم البطاقة يجب أن يكون 16 رقم')
        .transform((val) => val.replace(/\s/g, '')),
    cardName: z.string()
        .min(3, 'الاسم على البطاقة مطلوب')
        .max(50, 'الاسم طويل جداً')
        .regex(/^[a-zA-Z\s]+$/, 'الاسم يجب أن يحتوي على حروف إنجليزية فقط'),
    expiryDate: z.string()
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'تاريخ الانتهاء غير صحيح (MM/YY)')
        .refine((val) => {
            const [month, year] = val.split('/');
            const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
            return expiry > new Date();
        }, 'البطاقة منتهية الصلاحية'),
    cvv: z.string()
        .regex(/^\d{3,4}$/, 'CVV يجب أن يكون 3 أو 4 أرقام'),
});

export const mobileWalletSchema = z.object({
    phoneNumber: z.string()
        .regex(/^01[0-2,5]{1}[0-9]{8}$/, 'رقم الهاتف غير صحيح'),
    verificationCode: z.string()
        .length(6, 'كود التحقق يجب أن يكون 6 أرقام')
        .regex(/^\d+$/, 'كود التحقق يجب أن يحتوي على أرقام فقط')
        .optional(),
});

// ==================== Review Schemas ====================

export const reviewSchema = z.object({
    overall: z.number()
        .min(1, 'يرجى تقييم الخدمة')
        .max(5, 'التقييم يجب أن يكون من 1 إلى 5'),
    punctuality: z.number().min(1).max(5).optional(),
    professionalism: z.number().min(1).max(5).optional(),
    childInteraction: z.number().min(1).max(5).optional(),
    cleanliness: z.number().min(1).max(5).optional(),
    communication: z.number().min(1).max(5).optional(),
    textReview: z.string()
        .min(10, 'التقييم يجب أن يكون 10 أحرف على الأقل')
        .max(500, 'التقييم طويل جداً')
        .optional(),
});

// ==================== Dispute Schemas ====================

export const disputeSchema = z.object({
    bookingId: z.number().positive(),
    type: z.enum(['no_show', 'late', 'quality', 'payment', 'other']),
    description: z.string()
        .min(20, 'الوصف يجب أن يكون 20 حرف على الأقل')
        .max(1000, 'الوصف طويل جداً'),
    evidence: z.array(z.instanceof(File))
        .max(5, 'لا يمكن إرفاق أكثر من 5 ملفات')
        .optional(),
});

// ==================== Service Schemas ====================

export const serviceSchema = z.object({
    name: z.string()
        .min(5, 'اسم الخدمة يجب أن يكون 5 أحرف على الأقل')
        .max(100, 'اسم الخدمة طويل جداً'),
    description: z.string()
        .min(20, 'الوصف يجب أن يكون 20 حرف على الأقل')
        .max(500, 'الوصف طويل جداً'),
    pricePerHour: z.number()
        .min(20, 'السعر يجب أن يكون 20 جنيه على الأقل')
        .max(500, 'السعر مرتفع جداً'),
    minHours: z.number()
        .min(1, 'الحد الأدنى للساعات يجب أن يكون ساعة واحدة')
        .max(12, 'الحد الأدنى للساعات كبير جداً')
        .optional(),
});

// ==================== Helper Functions ====================

/**
 * Format Zod errors for display
 */
export const formatZodError = (error: z.ZodError): Record<string, string> => {
    const formatted: Record<string, string> = {};

    error.issues.forEach((err) => {
        const path = err.path.join('.');
        formatted[path] = err.message;
    });

    return formatted;
};

/**
 * Validate data with a schema
 */
export const validateData = <T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    return {
        success: false,
        errors: formatZodError(result.error),
    };
};
