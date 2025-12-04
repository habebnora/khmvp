// QR Scanner Component for verifying booking identity
// Uses device camera to scan QR codes

import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { validateQRCode } from '@/utils/qrCode';
import type { Language } from '../App';

interface QRScannerProps {
    language: Language;
    onScanSuccess: (bookingId: number) => void;
    onScanError: (error: string) => void;
    onClose: () => void;
    expectedBookingId?: number; // Optional: verify it matches expected booking
}

const translations = {
    ar: {
        title: 'مسح كود QR',
        description: 'وجهي الكاميرا نحو كود QR لتأكيد بدء الخدمة',
        scanning: 'جاري المسح...',
        success: 'تم التحقق بنجاح!',
        error: 'فشل التحقق',
        invalidCode: 'كود QR غير صالح',
        expiredCode: 'انتهت صلاحية الكود',
        wrongBooking: 'هذا الكود لحجز آخر',
        cameraError: 'خطأ في الوصول للكاميرا',
        tryAgain: 'حاول مرة أخرى',
        cancel: 'إلغاء',
        simulateScan: 'محاكاة المسح (تجريبي)',
        grantPermission: 'يرجى السماح بالوصول للكاميرا',
    },
    en: {
        title: 'Scan QR Code',
        description: 'Point camera at QR code to verify and start service',
        scanning: 'Scanning...',
        success: 'Verified Successfully!',
        error: 'Verification Failed',
        invalidCode: 'Invalid QR code',
        expiredCode: 'QR code has expired',
        wrongBooking: 'This code is for a different booking',
        cameraError: 'Camera access error',
        tryAgain: 'Try Again',
        cancel: 'Cancel',
        simulateScan: 'Simulate Scan (Demo)',
        grantPermission: 'Please grant camera permission',
    },
};

export default function QRScanner({
    language,
    onScanSuccess,
    onScanError,
    onClose,
    expectedBookingId,
}: QRScannerProps) {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const t = translations[language];

    // Request camera permission
    useEffect(() => {
        const requestCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }, // Use back camera on mobile
                });

                streamRef.current = stream;
                setHasPermission(true);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Camera access error:', error);
                setHasPermission(false);
                setErrorMessage(t.cameraError);
            }
        };

        requestCamera();

        // Cleanup
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Simulate QR scan (for demo purposes)
    const handleSimulateScan = async () => {
        setStatus('scanning');

        // Simulate scanning delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate successful scan
        const mockBookingId = expectedBookingId || 1;

        setStatus('success');
        setTimeout(() => {
            onScanSuccess(mockBookingId);
        }, 1000);
    };

    // Handle actual QR scan (would integrate with a QR scanning library)
    const handleActualScan = async (qrData: string) => {
        setStatus('scanning');

        try {
            const result = await validateQRCode(qrData);

            if (!result.valid) {
                setStatus('error');
                setErrorMessage(result.error || t.invalidCode);
                onScanError(result.error || t.invalidCode);
                return;
            }

            // Check if it matches expected booking
            if (expectedBookingId && result.bookingId !== expectedBookingId) {
                setStatus('error');
                setErrorMessage(t.wrongBooking);
                onScanError(t.wrongBooking);
                return;
            }

            // Success!
            setStatus('success');
            setTimeout(() => {
                onScanSuccess(result.bookingId!);
            }, 1000);
        } catch (error) {
            setStatus('error');
            setErrorMessage(t.error);
            onScanError(t.error);
        }
    };

    const handleRetry = () => {
        setStatus('idle');
        setErrorMessage('');
    };

    return (
        <Card className="p-6 max-w-md mx-auto">
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t.description}
                    </p>
                </div>

                {/* Camera View / Status */}
                <div className="relative">
                    {hasPermission === false ? (
                        // Camera permission denied
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-6">
                            <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                {t.grantPermission}
                            </p>
                        </div>
                    ) : status === 'success' ? (
                        // Success state
                        <div className="aspect-square bg-green-50 dark:bg-green-900/20 rounded-lg flex flex-col items-center justify-center">
                            <CheckCircle className="w-20 h-20 text-green-600 dark:text-green-400 mb-4 animate-bounce" />
                            <p className="text-green-700 dark:text-green-300 font-semibold">
                                {t.success}
                            </p>
                        </div>
                    ) : status === 'error' ? (
                        // Error state
                        <div className="aspect-square bg-red-50 dark:bg-red-900/20 rounded-lg flex flex-col items-center justify-center p-6">
                            <XCircle className="w-20 h-20 text-red-600 dark:text-red-400 mb-4" />
                            <p className="text-red-700 dark:text-red-300 font-semibold mb-2">
                                {t.error}
                            </p>
                            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                                {errorMessage}
                            </p>
                        </div>
                    ) : (
                        // Camera view
                        <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />

                            {/* Scanning overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 border-4 border-[#FB5E7A] rounded-lg relative">
                                    {/* Corner markers */}
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />

                                    {status === 'scanning' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status text */}
                            {status === 'scanning' && (
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <p className="text-white text-sm bg-black/50 inline-block px-4 py-2 rounded">
                                        {t.scanning}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {status === 'error' ? (
                        <>
                            <Button
                                onClick={handleRetry}
                                className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
                            >
                                {t.tryAgain}
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="w-full"
                            >
                                {t.cancel}
                            </Button>
                        </>
                    ) : status === 'success' ? (
                        <Button
                            onClick={onClose}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {t.success}
                        </Button>
                    ) : (
                        <>
                            {/* Demo button - remove in production */}
                            <Button
                                onClick={handleSimulateScan}
                                disabled={status === 'scanning'}
                                className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                {t.simulateScan}
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="w-full"
                            >
                                {t.cancel}
                            </Button>
                        </>
                    )}
                </div>

                {/* Note for production */}
                {process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-center text-gray-500">
                        Note: In production, integrate with a QR scanning library like react-qr-scanner or html5-qrcode
                    </p>
                )}
            </div>
        </Card>
    );
}
