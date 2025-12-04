// Report Problem Component
// Allows users to report issues with bookings

import { useState } from 'react';
import { AlertTriangle, Upload, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FormError, FieldError } from './FormError';
import { disputeSchema } from '@/schemas';
import { disputeTypeLabels, type DisputeType } from '@/types/dispute';
import { showSuccess, showError } from '@/utils/toast';
import type { Language } from '../App';

interface ReportProblemProps {
    language: Language;
    bookingId: number;
    onSubmit: (data: ReportData) => Promise<void>;
    onClose: () => void;
}

interface ReportData {
    bookingId: number;
    type: DisputeType;
    description: string;
    evidence?: File[];
}

const translations = {
    ar: {
        title: 'الإبلاغ عن مشكلة',
        description: 'يرجى وصف المشكلة بالتفصيل. سيتم مراجعة بلاغك من قبل فريق الدعم.',
        problemType: 'نوع المشكلة',
        selectType: 'اختر نوع المشكلة',
        problemDescription: 'وصف المشكلة',
        descriptionPlaceholder: 'اشرحي المشكلة بالتفصيل...',
        evidence: 'إرفاق أدلة (اختياري)',
        evidenceDesc: 'يمكنك إرفاق صور أو مستندات (حد أقصى 5 ملفات)',
        uploadFile: 'اختر ملف',
        submit: 'إرسال البلاغ',
        cancel: 'إلغاء',
        submitting: 'جاري الإرسال...',
        success: 'تم إرسال البلاغ بنجاح',
        error: 'فشل إرسال البلاغ',
        maxFiles: 'لا يمكن إرفاق أكثر من 5 ملفات',
        fileSize: 'حجم الملف كبير جداً (حد أقصى 5 ميجابايت)',
    },
    en: {
        title: 'Report a Problem',
        description: 'Please describe the problem in detail. Your report will be reviewed by our support team.',
        problemType: 'Problem Type',
        selectType: 'Select problem type',
        problemDescription: 'Problem Description',
        descriptionPlaceholder: 'Explain the problem in detail...',
        evidence: 'Attach Evidence (Optional)',
        evidenceDesc: 'You can attach images or documents (max 5 files)',
        uploadFile: 'Choose File',
        submit: 'Submit Report',
        cancel: 'Cancel',
        submitting: 'Submitting...',
        success: 'Report submitted successfully',
        error: 'Failed to submit report',
        maxFiles: 'Cannot attach more than 5 files',
        fileSize: 'File size too large (max 5MB)',
    },
};

export default function ReportProblem({
    language,
    bookingId,
    onSubmit,
    onClose,
}: ReportProblemProps) {
    const [type, setType] = useState<DisputeType | ''>('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const t = translations[language];
    const typeLabels = disputeTypeLabels[language];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        // Check file count
        if (files.length + selectedFiles.length > 5) {
            showError(t.maxFiles);
            return;
        }

        // Check file sizes
        const maxSize = 5 * 1024 * 1024; // 5MB
        const validFiles = selectedFiles.filter(file => {
            if (file.size > maxSize) {
                showError(`${file.name}: ${t.fileSize}`);
                return false;
            }
            return true;
        });

        setFiles([...files, ...validFiles]);
    };

    const handleRemoveFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validate
        const data = {
            bookingId,
            type: type as DisputeType,
            description,
            evidence: files.length > 0 ? files : undefined,
        };

        const result = disputeSchema.safeParse(data);

        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                const path = err.path.join('.');
                formattedErrors[path] = err.message;
            });
            setErrors(formattedErrors);
            return;
        }

        // Submit
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            showSuccess(t.success);
            onClose();
        } catch (error) {
            showError(t.error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="p-6 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t.description}
                        </p>
                    </div>
                </div>

                {/* Problem Type */}
                <div className="space-y-2">
                    <Label htmlFor="type">{t.problemType} *</Label>
                    <Select value={type} onValueChange={(value) => setType(value as DisputeType)}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder={t.selectType} />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(typeLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FieldError error={errors.type} />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">{t.problemDescription} *</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t.descriptionPlaceholder}
                        rows={6}
                        className="resize-none"
                    />
                    <FieldError error={errors.description} />
                </div>

                {/* Evidence Upload */}
                <div className="space-y-2">
                    <Label>{t.evidence}</Label>
                    <p className="text-xs text-gray-500">{t.evidenceDesc}</p>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-2 mb-3">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                                >
                                    <span className="text-sm truncate flex-1">{file.name}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFile(index)}
                                        className="h-6 w-6 p-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    {files.length < 5 && (
                        <div>
                            <input
                                type="file"
                                id="evidence"
                                multiple
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('evidence')?.click()}
                                className="w-full"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {t.uploadFile}
                            </Button>
                        </div>
                    )}
                    <FieldError error={errors.evidence} />
                </div>

                {/* Form Errors */}
                <FormError errors={errors} />

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        {t.cancel}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#FB5E7A] hover:bg-[#e5536e]"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                {t.submitting}
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                {t.submit}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
