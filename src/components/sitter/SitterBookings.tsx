import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, MessageCircle, FileText, Mic, StopCircle, Star, Play, Eye, QrCode, Activity } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import RequestDetails, { BookingRequest } from './RequestDetails';
import ChatPage from '../client/ChatPage';
import SitterSessionPage from './SitterSessionPage';
import type { Language } from '../../App';

interface SitterBookingsProps {
  language: Language;
}

interface Booking {
  id: number;
  clientName: string;
  clientImage: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  type: 'home' | 'outside';
  status: 'pending' | 'waiting_payment' | 'upcoming' | 'ongoing' | 'completed'; 
  price: number;
  children: number;
  notes?: string;
}

const translations = {
  ar: {
    myBookings: 'إدارة الحجوزات',
    calendar: 'التقويم',
    list: 'القائمة',
    requests: 'طلبات الانتظار',
    confirmed: 'المؤكدة',
    ongoing: 'الجارية',
    upcoming: 'القادمة',
    completed: 'المكتملة',
    date: 'التاريخ',
    time: 'الوقت',
    duration: 'المدة',
    hours: 'ساعات',
    children: 'طفل',
    atHome: 'في المنزل',
    outside: 'خارج المنزل',
    contact: 'تواصل',
    sendReport: 'إرسال تقرير',
    noBookings: 'لا توجد حجوزات في هذا القسم',
    egp: 'جنيه',
    writeReport: 'اكتبي تقرير الجلسة',
    submit: 'إرسال',
    cancel: 'إلغاء',
    reportSent: 'تم إرسال التقرير بنجاح',
    recordVoice: 'تسجيل صوتي',
    startRecording: 'بدء التسجيل',
    stopRecording: 'إيقاف التسجيل',
    playRecording: 'تشغيل التسجيل',
    rating: 'تقييم العميل',
    rateClient: 'كيف كانت تجربتك مع العميل؟',
    or: 'أو',
    voiceMessage: 'رسالة صوتية',
    viewDetails: 'عرض التفاصيل',
    pending: 'قيد الانتظار',
    waiting_payment: 'بانتظار الدفع',
    requestAccepted: 'تم قبول الطلب بنجاح. بانتظار دفع العميلة.',
    requestDeclined: 'تم رفض الطلب',
    showQR: 'عرض كود QR',
    qrTitle: 'كود تأكيد الهوية',
    qrDesc: 'اطلبي من العميلة مسح هذا الكود عند الوصول لبدء الخدمة.',
    manageSession: 'إدارة الجلسة',
  },
  en: {
    myBookings: 'Booking Management',
    calendar: 'Calendar',
    list: 'List',
    requests: 'Pending Requests',
    confirmed: 'Confirmed',
    ongoing: 'Ongoing',
    upcoming: 'Upcoming',
    completed: 'Completed',
    date: 'Date',
    time: 'Time',
    duration: 'Duration',
    hours: 'hours',
    children: 'child',
    atHome: 'At Home',
    outside: 'Outside',
    contact: 'Contact',
    sendReport: 'Send Report',
    noBookings: 'No bookings in this section',
    egp: 'EGP',
    writeReport: 'Write session report',
    submit: 'Submit',
    cancel: 'Cancel',
    reportSent: 'Report sent successfully',
    recordVoice: 'Voice Record',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    playRecording: 'Play Recording',
    rating: 'Rate Client',
    rateClient: 'How was your experience with the client?',
    or: 'OR',
    voiceMessage: 'Voice Message',
    viewDetails: 'View Details',
    pending: 'Pending',
    waiting_payment: 'Waiting Payment',
    requestAccepted: 'Request accepted. Waiting for client payment.',
    requestDeclined: 'Request declined',
    showQR: 'Show QR Code',
    qrTitle: 'Identity Verification Code',
    qrDesc: 'Ask the client to scan this code upon arrival to start the service.',
    manageSession: 'Manage Session',
  }
};

const mockBookings: Booking[] = [
  {
    id: 4,
    clientName: 'منى حسن',
    clientImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    date: '2024-11-28',
    time: '16:00',
    duration: 3,
    location: 'المنيا الجديدة',
    type: 'home',
    status: 'pending',
    price: 240,
    children: 1,
    notes: 'أول مرة نجرب الخدمة'
  },
  {
    id: 5,
    clientName: 'سارة أحمد',
    clientImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    date: '2024-11-29',
    time: '11:00',
    duration: 4,
    location: 'المنيا',
    type: 'outside',
    status: 'waiting_payment',
    price: 320,
    children: 2,
    notes: 'يرجى الحضور قبل الموعد بـ 10 دقائق'
  },
  {
    id: 1,
    clientName: 'أمل محمود',
    clientImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    date: '2024-11-25',
    time: '10:00',
    duration: 3,
    location: 'المنيا الجديدة',
    type: 'home',
    status: 'upcoming',
    price: 240,
    children: 2,
    notes: 'الأطفال يحبون القصص والألعاب التعليمية'
  },
  {
    id: 2,
    clientName: 'هدى سعيد',
    clientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    date: '2024-11-23',
    time: '14:00',
    duration: 2,
    location: 'المنيا',
    type: 'outside',
    status: 'ongoing',
    price: 200,
    children: 1
  },
  {
    id: 3,
    clientName: 'ريهام عادل',
    clientImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    date: '2024-11-20',
    time: '09:00',
    duration: 4,
    location: 'المنيا الجديدة',
    type: 'home',
    status: 'completed',
    price: 320,
    children: 3
  }
];

export default function SitterBookings({ language }: SitterBookingsProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSessionPage, setShowSessionPage] = useState(false);
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);
  const [sessionBooking, setSessionBooking] = useState<Booking | null>(null);

  const [report, setReport] = useState('');
  const [clientRating, setClientRating] = useState(0);
  
  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const t = translations[language];

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockBookings.filter(booking => booking.date === dateStr);
  };

  const handleSendReport = () => {
    if ((report.trim() || audioBlob) && clientRating > 0) {
      alert(t.reportSent);
      setShowReportDialog(false);
      setReport('');
      setAudioBlob(null);
      setClientRating(0);
      setSelectedBooking(null);
    } else {
        if (clientRating === 0) {
            alert(language === 'ar' ? 'يرجى تقييم العميل' : 'Please rate the client');
        }
    }
  };

  const handleAccept = (id: number) => {
    alert(t.requestAccepted);
    setSelectedBookingDetail(null);
  };

  const handleDecline = (id: number) => {
    alert(t.requestDeclined);
    setSelectedBookingDetail(null);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setAudioBlob(new Blob(["mock audio"], { type: 'audio/webm' }));
    } else {
      setIsRecording(true);
      setAudioBlob(null);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className={`p-4 ${booking.status === 'ongoing' ? 'border-green-500 border-2' : ''}`}>
      <div className="flex gap-4">
        <img
          src={booking.clientImage}
          alt={booking.clientName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="mb-1">{booking.clientName}</h4>
              <Badge variant="outline">
                {booking.children} {t.children}
              </Badge>
            </div>
            <Badge className={
              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              booking.status === 'waiting_payment' ? 'bg-orange-100 text-orange-700' :
              booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
              booking.status === 'ongoing' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }>
              {booking.status === 'pending' ? t.pending : 
               booking.status === 'waiting_payment' ? t.waiting_payment :
               t[booking.status]}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{booking.duration} {t.hours}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{booking.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge className={booking.type === 'home' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
              {booking.type === 'home' ? t.atHome : t.outside}
            </Badge>
            <div className="text-[#FB5E7A]">{booking.price} {t.egp}</div>
          </div>

          <div className="flex gap-2 mt-3">
            {/* Ongoing/Upcoming Special Actions */}
            {(booking.status === 'ongoing' || booking.status === 'upcoming') ? (
                <Button 
                    className={`w-full ${booking.status === 'ongoing' ? 'bg-green-600 hover:bg-green-700' : 'bg-[#FB5E7A] hover:bg-[#e5536e]'}`}
                    onClick={() => {
                        setSessionBooking(booking);
                        setShowSessionPage(true);
                    }}
                >
                    <Activity className="w-4 h-4 mr-2" />
                    {t.manageSession}
                </Button>
            ) : (
                <Button 
                    className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
                    onClick={() => setSelectedBookingDetail(booking)}
                >
                    <Eye className="w-4 h-4 mr-2" />
                    {t.viewDetails}
                </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderDetailActions = () => {
    if (!selectedBookingDetail) return null;

    if (selectedBookingDetail.status === 'waiting_payment') {
        return (
            <Button size="lg" variant="outline" className="w-full cursor-not-allowed opacity-70">
                <Clock className="w-5 h-5 mr-2" />
                {t.waiting_payment}
            </Button>
        );
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2">
                {(selectedBookingDetail.status === 'upcoming' || selectedBookingDetail.status === 'ongoing') && (
                   <>
                    <Button 
                        size="lg" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                            setSessionBooking(selectedBookingDetail);
                            setShowSessionPage(true);
                        }}
                    >
                        <Activity className="w-5 h-5 mr-2" />
                        {t.manageSession}
                    </Button>
                   </>
                )}
                {selectedBookingDetail.status === 'completed' && (
                    <Button
                        size="lg"
                        onClick={() => {
                            setSelectedBooking(selectedBookingDetail);
                            setShowReportDialog(true);
                        }}
                        className="flex-1 bg-[#FB5E7A] hover:bg-[#e5536e]"
                    >
                        <FileText className="w-5 h-5 mr-2" />
                        {t.sendReport}
                    </Button>
                )}
            </div>
        </div>
    );
  };

  // Render Conditional Pages
  if (showChat && selectedBooking) {
      return (
          <ChatPage 
            language={language}
            onBack={() => setShowChat(false)}
            recipientName={selectedBooking.clientName}
            recipientImage={selectedBooking.clientImage}
          />
      );
  }

  if (showSessionPage && sessionBooking) {
      return (
          <SitterSessionPage 
            language={language}
            booking={{
                ...sessionBooking,
                status: sessionBooking.status as 'upcoming' | 'ongoing'
            }}
            onBack={() => setShowSessionPage(false)}
          />
      );
  }

  // Main Sitter Bookings View
  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      {selectedBookingDetail ? (
         <RequestDetails 
            language={language}
            request={selectedBookingDetail as unknown as BookingRequest}
            onBack={() => setSelectedBookingDetail(null)}
            onAccept={selectedBookingDetail.status === 'pending' ? () => handleAccept(selectedBookingDetail.id) : undefined}
            onDecline={selectedBookingDetail.status === 'pending' ? () => handleDecline(selectedBookingDetail.id) : undefined}
            customActions={selectedBookingDetail.status !== 'pending' ? renderDetailActions() : undefined}
         />
      ) : (
        <>
            <h1 className="text-[#FB5E7A] mb-6">{t.myBookings}</h1>

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list">{t.list}</TabsTrigger>
                    <TabsTrigger value="calendar">{t.calendar}</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Tabs defaultValue="ongoing" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-4 h-auto flex-wrap">
                            <TabsTrigger value="ongoing">{t.ongoing}</TabsTrigger>
                            <TabsTrigger value="requests">{t.requests}</TabsTrigger>
                            <TabsTrigger value="confirmed">{t.confirmed}</TabsTrigger>
                            <TabsTrigger value="completed">{t.completed}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="ongoing" className="space-y-4">
                            {mockBookings.filter(b => b.status === 'ongoing').length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    {t.noBookings}
                                </div>
                            ) : (
                                mockBookings
                                .filter(b => b.status === 'ongoing')
                                .map(renderBookingCard)
                            )}
                        </TabsContent>

                        <TabsContent value="requests" className="space-y-4">
                            {mockBookings.filter(b => b.status === 'pending').length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    {t.noBookings}
                                </div>
                            ) : (
                                mockBookings
                                .filter(b => b.status === 'pending')
                                .map(renderBookingCard)
                            )}
                        </TabsContent>

                        <TabsContent value="confirmed" className="space-y-4">
                            {mockBookings.filter(b => b.status === 'waiting_payment' || b.status === 'upcoming').length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    {t.noBookings}
                                </div>
                            ) : (
                                mockBookings
                                .filter(b => b.status === 'waiting_payment' || b.status === 'upcoming')
                                .map(renderBookingCard)
                            )}
                        </TabsContent>

                        <TabsContent value="completed" className="space-y-4">
                            {mockBookings.filter(b => b.status === 'completed').length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    {t.noBookings}
                                </div>
                            ) : (
                                mockBookings
                                .filter(b => b.status === 'completed')
                                .map(renderBookingCard)
                            )}
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                <TabsContent value="calendar">
                    <Card className="p-6">
                        <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="mx-auto"
                        />
                        
                        <div className="mt-6 space-y-4">
                        <h3>{selectedDate.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</h3>
                        {getBookingsForDate(selectedDate).length === 0 ? (
                            <p className="text-center py-8 text-gray-500">{t.noBookings}</p>
                        ) : (
                            getBookingsForDate(selectedDate).map(renderBookingCard)
                        )}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
      )}

      {/* Report Dialog and QR Dialog (Optional if you want to keep it as a fallback) code preserved... */}
      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.sendReport}</DialogTitle>
            <DialogDescription>
              {language === 'ar' ? 'يرجى كتابة تقرير مفصل عن الجلسة أو تسجيل رسالة صوتية.' : 'Please write a detailed report about the session or record a voice message.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Client Rating */}
            <div className="space-y-2 text-center">
              <Label>{t.rateClient}</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setClientRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= clientRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
                <Textarea
                value={report}
                onChange={(e) => setReport(e.target.value)}
                placeholder={t.writeReport}
                rows={4}
                />
                <div className="text-center text-gray-500 text-sm">{t.or}</div>
                <div className="flex flex-col items-center gap-3">
                    <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="lg"
                        onClick={toggleRecording}
                        className={`rounded-full w-16 h-16 flex items-center justify-center ${isRecording ? 'animate-pulse' : ''}`}
                    >
                        {isRecording ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </Button>
                    <span className="text-sm font-mono">
                        {isRecording ? formatDuration(recordingDuration) : (audioBlob ? t.voiceMessage : t.recordVoice)}
                    </span>
                </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowReportDialog(false)}
                className="flex-1"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleSendReport}
                disabled={(!report.trim() && !audioBlob) || clientRating === 0}
                className="flex-1 bg-[#FB5E7A] hover:bg-[#e5536e]"
              >
                {t.submit}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}