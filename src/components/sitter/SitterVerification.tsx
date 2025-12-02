import { useState } from 'react';
import { ArrowLeft, ArrowRight, Upload, Check, X, FileText, AlertCircle, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import type { Language } from '../../App';

const translations = {
  ar: {
    back: 'رجوع',
    verification: 'توثيق الحساب',
    verificationRequired: 'يجب توثيق حسابك لقبول الطلبات',
    policeRecord: 'الفيش الجنائي',
    policeRecordDesc: 'يرجى رفع صورة واضحة من الفيش الجنائي',
    uploadDocument: 'رفع المستند',
    changeDocument: 'تغيير المستند',
    nationalId: 'البطاقة الشخصية',
    nationalIdDesc: 'صورة من البطاقة الشخصية (الوجهين)',
    uploadFront: 'رفع الوجه الأمامي',
    uploadBack: 'رفع الوجه الخلفي',
    status: 'الحالة',
    pending: 'قيد المراجعة',
    approved: 'موثق',
    rejected: 'مرفوض',
    notUploaded: 'لم يتم الرفع',
    uploadedSuccessfully: 'تم الرفع بنجاح',
    submit: 'إرسال للمراجعة',
    verificationPending: 'طلب التوثيق قيد المراجعة',
    verificationApproved: 'تم توثيق حسابك بنجاح',
    verificationRejected: 'تم رفض طلب التوثيق',
    rejectionReason: 'سبب الرفض',
    resubmit: 'إعادة الإرسال',
    requirements: 'المتطلبات',
    requirement1: 'صورة واضحة للفيش الجنائي',
    requirement2: 'صورة البطاقة الشخصية (الوجهين)',
    requirement3: 'المستندات يجب أن تكون سارية',
    requirement4: 'الصور يجب أن تكون واضحة ومقروءة',
    note: 'ملحوظة',
    noteText: 'عملية المراجعة تستغرق من 24-48 ساعة',
    cannotAcceptRequests: 'لا يمكنك قبول طلبات حتى يتم توثيق حسابك',
  },
  en: {
    back: 'Back',
    verification: 'Account Verification',
    verificationRequired: 'You must verify your account to accept requests',
    policeRecord: 'Police Clearance Certificate',
    policeRecordDesc: 'Please upload a clear copy of your police clearance certificate',
    uploadDocument: 'Upload Document',
    changeDocument: 'Change Document',
    nationalId: 'National ID',
    nationalIdDesc: 'Photo of National ID (both sides)',
    uploadFront: 'Upload Front Side',
    uploadBack: 'Upload Back Side',
    status: 'Status',
    pending: 'Under Review',
    approved: 'Verified',
    rejected: 'Rejected',
    notUploaded: 'Not Uploaded',
    uploadedSuccessfully: 'Uploaded Successfully',
    submit: 'Submit for Review',
    verificationPending: 'Verification request under review',
    verificationApproved: 'Your account has been verified successfully',
    verificationRejected: 'Verification request rejected',
    rejectionReason: 'Rejection Reason',
    resubmit: 'Resubmit',
    requirements: 'Requirements',
    requirement1: 'Clear photo of police clearance certificate',
    requirement2: 'National ID photo (both sides)',
    requirement3: 'Documents must be valid',
    requirement4: 'Photos must be clear and readable',
    note: 'Note',
    noteText: 'Review process takes 24-48 hours',
    cannotAcceptRequests: 'You cannot accept requests until your account is verified',
  }
};

interface SitterVerificationProps {
  language: Language;
  onBack: () => void;
}

export default function SitterVerification({ language, onBack }: SitterVerificationProps) {
  const [policeRecordFile, setPoliceRecordFile] = useState<File | null>(null);
  const [nationalIdFrontFile, setNationalIdFrontFile] = useState<File | null>(null);
  const [nationalIdBackFile, setNationalIdBackFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'not_submitted' | 'pending' | 'approved' | 'rejected'>('not_submitted');
  const [rejectionReason, setRejectionReason] = useState('');

  const t = translations[language];

  const handlePoliceRecordUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPoliceRecordFile(e.target.files[0]);
    }
  };

  const handleNationalIdFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNationalIdFrontFile(e.target.files[0]);
    }
  };

  const handleNationalIdBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNationalIdBackFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!policeRecordFile || !nationalIdFrontFile || !nationalIdBackFile) {
      alert(language === 'ar' ? 'يرجى رفع جميع المستندات المطلوبة' : 'Please upload all required documents');
      return;
    }

    // In real app, this would upload to backend
    console.log('Submitting verification:', {
      policeRecord: policeRecordFile,
      nationalIdFront: nationalIdFrontFile,
      nationalIdBack: nationalIdBackFile
    });

    setVerificationStatus('pending');
    alert(language === 'ar' ? 'تم إرسال طلب التوثيق بنجاح' : 'Verification request submitted successfully');
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'pending':
        return <Badge className="bg-yellow-500">{t.pending}</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">{t.approved}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">{t.rejected}</Badge>;
      default:
        return <Badge variant="outline">{t.notUploaded}</Badge>;
    }
  };

  const isDocumentsComplete = policeRecordFile && nationalIdFrontFile && nationalIdBackFile;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="p-2"
            >
              {language === 'ar' ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
            </Button>
            <div className="flex-1">
              <h1 className="text-xl">{t.verification}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.verificationRequired}</p>
            </div>
            {getStatusBadge()}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Status Alerts */}
        {verificationStatus === 'not_submitted' && (
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              {t.cannotAcceptRequests}
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === 'pending' && (
          <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              {t.verificationPending}
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === 'approved' && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {t.verificationApproved}
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === 'rejected' && (
          <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
            <X className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <div>{t.verificationRejected}</div>
              {rejectionReason && (
                <div className="mt-2 text-sm">
                  <strong>{t.rejectionReason}:</strong> {rejectionReason}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Requirements */}
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-[#FB5E7A] mt-1" />
            <div>
              <h2 className="text-lg mb-2">{t.requirements}</h2>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{t.requirement1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{t.requirement2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{t.requirement3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{t.requirement4}</span>
                </li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{t.note}:</strong> {t.noteText}
            </AlertDescription>
          </Alert>
        </Card>

        {/* Police Record Upload */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FB5E7A]/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#FB5E7A]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg">{t.policeRecord}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.policeRecordDesc}</p>
              </div>
              {policeRecordFile && <Check className="size-6 text-green-500" />}
            </div>

            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {policeRecordFile ? (
                <div className="space-y-3">
                  <FileText className="size-12 mx-auto text-green-500" />
                  <div>
                    <p className="text-sm">{policeRecordFile.name}</p>
                    <p className="text-xs text-gray-500">{(policeRecordFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Label htmlFor="police-record-change" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>{t.changeDocument}</span>
                    </Button>
                  </Label>
                  <Input
                    id="police-record-change"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handlePoliceRecordUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="size-12 mx-auto text-gray-400" />
                  <Label htmlFor="police-record-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>{t.uploadDocument}</span>
                    </Button>
                  </Label>
                  <Input
                    id="police-record-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handlePoliceRecordUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* National ID Upload */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg">{t.nationalId}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.nationalIdDesc}</p>
              </div>
              {nationalIdFrontFile && nationalIdBackFile && <Check className="size-6 text-green-500" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Front Side */}
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {nationalIdFrontFile ? (
                  <div className="space-y-3">
                    <FileText className="size-10 mx-auto text-green-500" />
                    <div>
                      <p className="text-xs">{nationalIdFrontFile.name}</p>
                      <p className="text-xs text-gray-500">{(nationalIdFrontFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <Label htmlFor="national-id-front-change" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>{t.changeDocument}</span>
                      </Button>
                    </Label>
                    <Input
                      id="national-id-front-change"
                      type="file"
                      accept="image/*"
                      onChange={handleNationalIdFrontUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="size-10 mx-auto text-gray-400" />
                    <Label htmlFor="national-id-front-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>{t.uploadFront}</span>
                      </Button>
                    </Label>
                    <Input
                      id="national-id-front-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleNationalIdFrontUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Back Side */}
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {nationalIdBackFile ? (
                  <div className="space-y-3">
                    <FileText className="size-10 mx-auto text-green-500" />
                    <div>
                      <p className="text-xs">{nationalIdBackFile.name}</p>
                      <p className="text-xs text-gray-500">{(nationalIdBackFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <Label htmlFor="national-id-back-change" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>{t.changeDocument}</span>
                      </Button>
                    </Label>
                    <Input
                      id="national-id-back-change"
                      type="file"
                      accept="image/*"
                      onChange={handleNationalIdBackUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="size-10 mx-auto text-gray-400" />
                    <Label htmlFor="national-id-back-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>{t.uploadBack}</span>
                      </Button>
                    </Label>
                    <Input
                      id="national-id-back-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleNationalIdBackUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        {verificationStatus !== 'approved' && (
          <Button
            onClick={handleSubmit}
            disabled={!isDocumentsComplete || verificationStatus === 'pending'}
            className="w-full bg-[#FB5E7A] hover:bg-[#e5536e] disabled:opacity-50"
            size="lg"
          >
            {verificationStatus === 'rejected' ? t.resubmit : t.submit}
          </Button>
        )}
      </div>
    </div>
  );
}
