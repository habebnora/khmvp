import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, X, Clock, MapPin, Calendar, User, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Avatar } from '../ui/avatar';
import type { Language } from '../../stores/useAuthStore';
import { bookingService, type Booking } from '../../services/booking';
import { notificationService } from '../../services/notification';
import { sitterService } from '../../services/sitter';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from 'sonner';

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
    atHome: 'في منزل العميلة',
    outside: 'خارج المنزل',
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
    atHome: 'At Client Home',
    outside: 'Outside',
  }
};

// Removed mock BookingRequest interface

interface BookingRequestsProps {
  language: Language;
  isVerified: boolean;
  onBack: () => void;
}

export default function BookingRequests({ language, isVerified, onBack }: BookingRequestsProps) {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadData();
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;
    try {
      const data = await sitterService.getProfile(user.id);
      setProfile(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await bookingService.getSitterBookings(user.id);
      setRequests(data);
    } catch (error) {
      console.error(error);
      toast.error(language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const [selectedRequest, setSelectedRequest] = useState<Booking | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<'accept' | 'decline' | null>(null);

  const t = translations[language];

  const handleAccept = async (request: Booking) => {
    try {
      await bookingService.updateStatus(request.id, 'waiting_payment');

      // Notification
      await notificationService.createNotification({
        user_id: request.client_id,
        type: 'booking_accepted',
        title: language === 'ar' ? 'تم قبول طلبك' : 'Booking Accepted',
        message: language === 'ar'
          ? `تم قبول طلبك من أختك ${profile?.full_name || 'الخالة'}. يرجى إتمام عملية الدفع.`
          : `Your booking has been accepted by ${profile?.full_name || 'the sitter'}. Please complete the payment.`,
        data: { booking_id: request.id }
      });

      toast.success(language === 'ar' ? 'تم قبول الطلب وبانتظار الدفع' : 'Request Accepted');
      setShowConfirmDialog(null);
      setSelectedRequest(null);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(language === 'ar' ? 'حدث خطأ' : 'Error occurred');
    }
  };

  const handleDecline = async (request: Booking) => {
    try {
      await bookingService.updateStatus(request.id, 'cancelled');

      // Notification
      await notificationService.createNotification({
        user_id: request.client_id,
        type: 'booking_declined',
        title: language === 'ar' ? 'تم رفض الطلب' : 'Booking Declined',
        message: language === 'ar'
          ? `نعتذر، تم اعتذار أختك ${profile?.full_name || 'الخالة'} عن قبول الطلب.`
          : `Sorry, ${profile?.full_name || 'the sitter'} has declined your booking request.`,
        data: { booking_id: request.id }
      });

      toast.success(language === 'ar' ? 'تم رفض الطلب' : 'Request Declined');
      setShowConfirmDialog(null);
      setSelectedRequest(null);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(language === 'ar' ? 'حدث خطأ' : 'Error occurred');
    }
  };

  /* Removed getServiceName */

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
                        <img src={request.client?.avatar_url || ''} alt={request.client?.full_name} />
                      </Avatar>
                      <div>
                        <h3>{request.client?.full_name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.booking_type === 'home' ? t.atHome : t.outside}</p>
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
                      <span>{request.start_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-gray-400" />
                      <span>{request.children_count || 1} {t.children}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#FB5E7A]">{request.total_price} {t.egp}</span>
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
                        <img src={request.client?.avatar_url || ''} alt={request.client?.full_name} />
                      </Avatar>
                      <div>
                        <h3 className="text-sm">{request.client?.full_name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{request.booking_type === 'home' ? t.atHome : t.outside}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{request.date} - {request.start_time}</span>
                    <span className="text-[#FB5E7A]">{request.total_price} {t.egp}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-[#FB5E7A] animate-spin" />
          </div>
        )}

        {/* No Requests */}
        {!loading && requests.length === 0 && (
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
                    handleAccept(selectedRequest);
                  } else {
                    handleDecline(selectedRequest);
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
