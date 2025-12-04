// Dispute and Support System Types

export type DisputeType = 'no_show' | 'late' | 'quality' | 'payment' | 'behavior' | 'other';
export type DisputeStatus = 'open' | 'in_review' | 'resolved' | 'closed';
export type ReportedBy = 'client' | 'sitter';

export interface Evidence {
    id: string;
    type: 'image' | 'document' | 'audio';
    url: string;
    filename: string;
    uploadedAt: Date;
}

export interface Dispute {
    id: number;
    bookingId: number;
    reportedBy: ReportedBy;
    type: DisputeType;
    status: DisputeStatus;
    title: string;
    description: string;
    evidence: Evidence[];
    resolution?: string;
    resolvedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
}

export interface SupportTicket {
    id: number;
    userId: number;
    userType: 'client' | 'sitter';
    category: 'technical' | 'account' | 'payment' | 'booking' | 'other';
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
    subject: string;
    description: string;
    attachments: Evidence[];
    messages: TicketMessage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface TicketMessage {
    id: number;
    ticketId: number;
    senderId: number;
    senderType: 'user' | 'support';
    message: string;
    attachments?: Evidence[];
    createdAt: Date;
}

// Translations
export const disputeTypeLabels = {
    ar: {
        no_show: 'عدم الحضور',
        late: 'تأخير',
        quality: 'جودة الخدمة',
        payment: 'مشكلة في الدفع',
        behavior: 'سلوك غير لائق',
        other: 'أخرى',
    },
    en: {
        no_show: 'No Show',
        late: 'Late Arrival',
        quality: 'Service Quality',
        payment: 'Payment Issue',
        behavior: 'Inappropriate Behavior',
        other: 'Other',
    },
};

export const disputeStatusLabels = {
    ar: {
        open: 'مفتوح',
        in_review: 'قيد المراجعة',
        resolved: 'تم الحل',
        closed: 'مغلق',
    },
    en: {
        open: 'Open',
        in_review: 'In Review',
        resolved: 'Resolved',
        closed: 'Closed',
    },
};

export const supportCategoryLabels = {
    ar: {
        technical: 'مشكلة تقنية',
        account: 'الحساب',
        payment: 'الدفع',
        booking: 'الحجز',
        other: 'أخرى',
    },
    en: {
        technical: 'Technical Issue',
        account: 'Account',
        payment: 'Payment',
        booking: 'Booking',
        other: 'Other',
    },
};
