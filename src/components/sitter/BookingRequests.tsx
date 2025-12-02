import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, X, Clock, MapPin, Calendar, User, Phone, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Avatar } from '../ui/avatar';
import type { Language } from '../../App';

const translations = {
  ar: {
    back: 'رجوع',
    bookingRequests: 'طلبات الحجز',
    pending: 'قيد الانتظار',
    accepted: 'مقبولة',
    rejected: 'مرفوضة',
    noRequests: 'لا توجد طلبات',
    accept: 'قبول',
    decline: 'رفض',
    client: 'العميلة',
    service: 'الخدمة',
    date: 'التاريخ',
    time: 'الوقت',
    duration: 'المدة',
    hours: 'ساعات',
    days: 'أيام',
    location: 'الموقع',
    amount: 'المبلغ',
    egp: 'جنيه',
    viewDetails: 'عرض التفاصيل',
    requestDetails: 'تفاصيل الطلب',
    acceptRequest: 'قبول الطلب',
    declineRequest: 'رفض الطلب',
    areYouSure: 'هل أنت متأكدة؟',
    acceptConfirm: 'سيتم إرسال إشعار للعميلة بقبول الطلب',
    declineConfirm: 'سيتم إرسال إشعار للعميلة برفض الطلب',
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    requestAccepted: 'تم قبول الطلب',
    requestDeclined: 'تم رفض الطلب',
    waitingPayment: 'في انتظار الدفع من العميلة',
    paid: 'تم الدفع',
    notes: 'ملاحظات',
    phoneNumber: 'رقم الهاتف',
    children: 'عدد الأطفال',
    hourlyUrgent: 'ساعات فردية (مستعجل)',
    weeklyContract: 'دوام أسبوعي',
    monthlyContract: 'دوام شهري',
  },
  en: {
    back: 'Back',
    bookingRequests: 'Booking Requests',
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    noRequests: 'No requests',
    accept: 'Accept',
    decline: 'Decline',
    client: 'Client',
    service: 'Service',
    date: 'Date',
    time: 'Time',
    duration: 'Duration',
    hours: 'hours',
    days: 'days',
    location: 'Location',
    amount: 'Amount',
    egp: 'EGP',
    viewDetails: 'View Details',
    requestDetails: 'Request Details',
    acceptRequest: 'Accept Request',
    declineRequest: 'Decline Request',
    areYouSure: 'Are you sure?',
    acceptConfirm: 'Client will be notified of your acceptance',
    declineConfirm: 'Client will be notified of your rejection',
    confirm: 'Confirm',
    cancel: 'Cancel',
    requestAccepted: 'Request Accepted',
    requestDeclined: 'Request Declined',
    waitingPayment: 'Waiting for client payment',
    paid: 'Paid',
    notes: 'Notes',
    phoneNumber: 'Phone Number',
    children: 'Number of Children',
    hourlyUrgent: 'Hourly (Urgent)',
    weeklyContract: 'Weekly Contract',
    monthlyContract: 'Monthly Contract',
  }
};

interface BookingRequest {
  id: string;
  clientName: string;
  clientImage: string;
  clientPhone: string;
  service: 'hourly' | 'weekly' | 'monthly';
  date: string;
  time: string;
  duration: number;
  location: string;
  amount: number;
  children: number;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
  createdAt: string;
}

interface BookingRequestsProps {
  language: Language;
  isVerified: boolean;
  onBack: () => void;
}

export default function BookingRequests({ language, isVerified, onBack }: BookingRequestsProps) {
  const [requests, setRequests] = useState<BookingRequest[]>([
    {
      id: '1',
      clientName: 'سارة أحمد',
      clientImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
      clientPhone: '01012345678',
      service: 'hourly',
      date: '2024-12-01',
      time: '09:00',
      duration: 5,
      location: '15 شارع النيل، المعادي، القاهرة',
      amount: 250,
      children: 2,
      notes: 'طفلان، 3 و 5 سنوات. يفضلون اللعب بالألوان',
      status: 'pending',
      createdAt: '2024-11-25T10:30:00'
    },
    {
      id: '2',
      clientName: 'منى محمد',
      clientImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mona',
      clientPhone: '01098765432',
      service: 'weekly',
      date: '2024-12-02',
      time: '14:00',
      duration: 20,
      location: '42 شارع الجامعة، المهندسين، الجيزة',
      amount: 1200,
      children: 1,
      notes: 'طفل واحد 4 سنوات، دوام من الاثنين للجمعة',
      status: 'pending',
      createdAt: '2024-11-25T11:00:00'
    },
    {
      id: '3',
      clientName: 'ليلى حسن',
      clientImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laila',
      clientPhone: '01234567890',
      service: 'hourly',
      date: '2024-11-30',
      time: '16:00',
      duration: 3,
      location: '7 شارع الحرية، مصر الجديدة، القاهرة',
      amount: 150,
      children: 1,
      notes: 'طفل رضيع 6 شهور',
      status: 'accepted',
      createdAt: '2024-11-24T15:20:00'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<'accept' | 'decline' | null>(null);

  const t = translations[language];

  const handleAccept = (requestId: string) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    ));
    setShowConfirmDialog(null);
    setSelectedRequest(null);
    alert(t.requestAccepted + ' - ' + t.waitingPayment);
  };

  const handleDecline = (requestId: string) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    ));
    setShowConfirmDialog(null);
    setSelectedRequest(null);
    alert(t.requestDeclined);
  };

  const getServiceName = (service: string) => {
    switch (service) {
      case 'hourly':
        return t.hourlyUrgent;
      case 'weekly':
        return t.weeklyContract;
      case 'monthly':
        return t.monthlyContract;
      default:
        return service;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">{t.pending}</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-500">{t.waitingPayment}</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">{t.paid}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">{t.rejected}</Badge>;
      default:
        return null;
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const otherRequests = requests.filter(r => r.status !== 'pending');

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
              <h1 className="text-xl">{t.bookingRequests}</h1>
            </div>
            {pendingRequests.length > 0 && (
              <Badge className="bg-[#FB5E7A]">{pendingRequests.length}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Verification Alert */}
        {!isVerified && (
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              {language === 'ar' ? 'يجب توثيق حسابك لقبول الطلبات' : 'You must verify your account to accept requests'}
            </AlertDescription>
          </Alert>
        )}

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg">{t.pending}</h2>
            {pendingRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <img src={request.clientImage} alt={request.clientName} />
                      </Avatar>
                      <div>
                        <h3>{request.clientName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{getServiceName(request.service)}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-400" />
                      <span>{request.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-gray-400" />
                      <span>{request.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-gray-400" />
                      <span>{request.children} {t.children}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#FB5E7A]">{request.amount} {t.egp}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="size-4 text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{request.location}</span>
                  </div>

                  {request.notes && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm">
                      <strong>{t.notes}:</strong> {request.notes}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowConfirmDialog('accept');
                      }}
                      disabled={!isVerified}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Check className="size-4" />
                      {t.accept}
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowConfirmDialog('decline');
                      }}
                      disabled={!isVerified}
                      variant="outline"
                      className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="size-4" />
                      {t.decline}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Other Requests */}
        {otherRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg">{t.accepted} / {t.rejected}</h2>
            {otherRequests.map((request) => (
              <Card key={request.id} className="p-4 opacity-75">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <img src={request.clientImage} alt={request.clientName} />
                      </Avatar>
                      <div>
                        <h3 className="text-sm">{request.clientName}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{getServiceName(request.service)}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{request.date} - {request.time}</span>
                    <span className="text-[#FB5E7A]">{request.amount} {t.egp}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Requests */}
        {requests.length === 0 && (
          <Card className="p-12 text-center">
            <AlertCircle className="size-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">{t.noRequests}</p>
          </Card>
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-lg mb-4">
              {showConfirmDialog === 'accept' ? t.acceptRequest : t.declineRequest}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {showConfirmDialog === 'accept' ? t.acceptConfirm : t.declineConfirm}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (showConfirmDialog === 'accept') {
                    handleAccept(selectedRequest.id);
                  } else {
                    handleDecline(selectedRequest.id);
                  }
                }}
                className={showConfirmDialog === 'accept' ? 'flex-1 bg-green-500 hover:bg-green-600' : 'flex-1 bg-red-500 hover:bg-red-600'}
              >
                {t.confirm}
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmDialog(null);
                  setSelectedRequest(null);
                }}
                variant="outline"
                className="flex-1"
              >
                {t.cancel}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
