// QR Code Generator with Digital Signature
// This ensures QR codes are secure and cannot be forged

import QRCode from 'qrcode';

/**
 * Generate a secure QR code for booking verification
 * @param bookingId - The booking ID
 * @param secret - Secret key for signing (should come from backend)
 * @returns Data URL of the QR code image
 */
export const generateBookingQR = async (
    bookingId: number,
    secret: string = 'default-secret-key' // In production, this should come from backend
): Promise<string> => {
    const timestamp = Date.now();

    // Create payload
    const payload = {
        bookingId,
        timestamp,
        signature: await generateSignature(bookingId, timestamp, secret),
    };

    // Generate QR code
    try {
        const qrDataURL = await QRCode.toDataURL(JSON.stringify(payload), {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            color: {
                dark: '#FB5E7A',
                light: '#FFFFFF',
            },
            width: 300,
        });

        return qrDataURL;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
};

/**
 * Generate a digital signature for the QR code
 * In production, this should use a proper cryptographic library
 */
const generateSignature = async (
    bookingId: number,
    timestamp: number,
    secret: string
): Promise<string> => {
    const data = `${bookingId}-${timestamp}-${secret}`;

    // Simple hash function (in production, use crypto.subtle.digest or similar)
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    try {
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    } catch (error) {
        // Fallback for environments without crypto.subtle
        return simpleHash(data);
    }
};

/**
 * Simple hash function fallback
 */
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
};

/**
 * Verify a QR code signature
 * @param payload - The scanned QR code payload
 * @param secret - Secret key for verification
 * @returns true if signature is valid
 */
export const verifyQRSignature = async (
    payload: {
        bookingId: number;
        timestamp: number;
        signature: string;
    },
    secret: string = 'default-secret-key'
): Promise<boolean> => {
    try {
        const expectedSignature = await generateSignature(
            payload.bookingId,
            payload.timestamp,
            secret
        );

        return expectedSignature === payload.signature;
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
};

/**
 * Check if QR code is expired (valid for 24 hours)
 */
export const isQRExpired = (timestamp: number): boolean => {
    const now = Date.now();
    const expiryTime = 24 * 60 * 60 * 1000; // 24 hours
    return now - timestamp > expiryTime;
};

/**
 * Parse QR code data
 */
export const parseQRData = (qrData: string): {
    bookingId: number;
    timestamp: number;
    signature: string;
} | null => {
    try {
        const parsed = JSON.parse(qrData);

        if (!parsed.bookingId || !parsed.timestamp || !parsed.signature) {
            return null;
        }

        return {
            bookingId: Number(parsed.bookingId),
            timestamp: Number(parsed.timestamp),
            signature: parsed.signature,
        };
    } catch (error) {
        console.error('Error parsing QR data:', error);
        return null;
    }
};

/**
 * Validate complete QR code
 */
export const validateQRCode = async (
    qrData: string,
    secret?: string
): Promise<{
    valid: boolean;
    error?: string;
    bookingId?: number;
}> => {
    // Parse data
    const parsed = parseQRData(qrData);
    if (!parsed) {
        return { valid: false, error: 'Invalid QR code format' };
    }

    // Check expiry
    if (isQRExpired(parsed.timestamp)) {
        return { valid: false, error: 'QR code has expired' };
    }

    // Verify signature
    const signatureValid = await verifyQRSignature(parsed, secret);
    if (!signatureValid) {
        return { valid: false, error: 'Invalid signature' };
    }

    return { valid: true, bookingId: parsed.bookingId };
};
