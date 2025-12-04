// QR Display Component for Sitters
// Shows QR code that clients can scan to verify identity

import { useState, useEffect } from 'react';
import { QrCode, Download, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { generateBookingQR } from '@/utils/qrCode';
import type { Language } from '../App';

interface QRDisplayProps {
    language: Language;
    bookingId: number;
    onClose?: () => void;
}

const translations = {
    ar: {
        title: 'كود تأكيد الهوية',
        description: 'اطلبي من العميلة مسح هذا الكود عند الوصول لبدء الخدمة',
        bookingId: 'رقم الحجز',
        validFor: 'صالح لمدة 24 ساعة',
        generating: 'جاري إنشاء الكود...',
        refresh: 'تحديث الكود',
        download: 'تحميل',
        copyId: 'نسخ رقم الحجز',
        copied: 'تم النسخ!',
        error: 'فشل إنشاء الكود',
        close: 'إغلاق',
    },
    en: {
        title: 'Identity Verification Code',
        description: 'Ask the client to scan this code upon arrival to start the service',
        bookingId: 'Booking ID',
        validFor: 'Valid for 24 hours',
        generating: 'Generating code...',
        refresh: 'Refresh Code',
        download: 'Download',
        copyId: 'Copy Booking ID',
        copied: 'Copied!',
        error: 'Failed to generate code',
        close: 'Close',
    },
};

export default function QRDisplay({
    language,
    bookingId,
    onClose,
}: QRDisplayProps) {
    const [qrCode, setQrCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const t = translations[language];

    // Generate QR code
    const generateQR = async () => {
        setIsLoading(true);
        setError('');

        try {
            const qr = await generateBookingQR(bookingId);
            setQrCode(qr);
        } catch (err) {
            console.error('Error generating QR:', err);
            setError(t.error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        generateQR();
    }, [bookingId]);

    // Download QR code
    const handleDownload = () => {
        if (!qrCode) return;

        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `booking-${bookingId}-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Copy booking ID
    const handleCopyId = async () => {
        try {
            await navigator.clipboard.writeText(bookingId.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Card className="p-6 max-w-md mx-auto">
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#FB5E7A]/10 flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-[#FB5E7A]" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t.description}
                    </p>
                </div>

                {/* QR Code Display */}
                <div className="relative">
                    {isLoading ? (
                        // Loading state
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FB5E7A] mx-auto mb-4" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t.generating}
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        // Error state
                        <div className="aspect-square bg-red-50 dark:bg-red-900/20 rounded-lg flex flex-col items-center justify-center p-6">
                            <p className="text-red-600 dark:text-red-400 text-center mb-4">
                                {error}
                            </p>
                            <Button
                                onClick={generateQR}
                                variant="outline"
                                size="sm"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                {t.refresh}
                            </Button>
                        </div>
                    ) : (
                        // QR Code
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <img
                                src={qrCode}
                                alt="QR Code"
                                className="w-full h-auto"
                            />
                        </div>
                    )}
                </div>

                {/* Booking Info */}
                {!isLoading && !error && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t.bookingId}:
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold">#{bookingId}</span>
                                <Button
                                    onClick={handleCopyId}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2"
                                >
                                    {copied ? (
                                        <Check className="w-3 h-3 text-green-600" />
                                    ) : (
                                        <Copy className="w-3 h-3" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            {t.validFor}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {!isLoading && !error && (
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="w-full"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {t.download}
                            </Button>
                            <Button
                                onClick={generateQR}
                                variant="outline"
                                className="w-full"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                {t.refresh}
                            </Button>
                        </div>
                    )}

                    {onClose && (
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="w-full"
                        >
                            {t.close}
                        </Button>
                    )}
                </div>

                {/* Security Note */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
                        {language === 'ar'
                            ? '⚠️ لا تشاركي هذا الكود مع أي شخص آخر غير العميلة'
                            : '⚠️ Do not share this code with anyone except the client'
                        }
                    </p>
                </div>
            </div>
        </Card>
    );
}
