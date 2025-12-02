import { TrendingUp, Calendar, Star, DollarSign, Clock, Check, X, Settings, FileText, Bell, Eye } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import AvailabilityManagement from './AvailabilityManagement';
import ServicesManagement from './ServicesManagement';
import SitterVerification from './SitterVerification';
import BookingRequests from './BookingRequests';
import RequestDetails from './RequestDetails';
import type { Language } from '../../App';

interface SitterHomeProps {
  language: Language;
}

interface BookingRequest {
  id: number;
  clientName: string;
  clientImage: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  type: 'home' | 'outside';
  price: number;
  children: number;
  notes?: string;
}

const translations = {
  ar: {
    welcome: 'مرحباً',
    dashboard: 'لوحة التحكم',
    thisMonth: 'هذا الشهر',
    totalEarnings: 'إجمالي الأرباح',
    completedJobs: 'جلسات مكتملة',
    rating: 'التقييم',
    totalHours: 'إجمالي ساعات العمل',
    upcomingBookings: 'الحجوزات القادمة',
    newRequests: 'طلبات جديدة',
    noRequests: 'لا توجد طلبات جديدة',
    accept: 'قبول',
    decline: 'رفض',
    children: 'طفل',
    hours: 'ساعات',
    egp: 'جنيه',
    atHome: 'في المنزل',
    outside: 'خارج المنزل',
    viewAll: 'عرض الكل',
    availability: 'الأوقات المتاحة',
    available: 'متاحة',
    unavailable: 'غير متاحة',
    toggleAvailability: 'تغيير الحالة',
    manageSchedule: 'إدارة المواعيد',
    scheduleDesc: 'حددي الأيام والأوقات المتاحة للعمل',
    notifications: 'الإشعارات',
    noNotifications: 'لا توجد إشعارات',
    newBookingRequest: 'طلب حجز جديد',
    bookingConfirmed: 'تم تأكيد الحجز',
    bookingCancelled: 'تم إلغاء الحجز',
    newReview: 'تقييم جديد',
    minutesAgo: 'منذ {time} دقيقة',
    hoursAgo: 'منذ {time} ساعة',
    daysAgo: 'منذ {time} يوم',
    markAllRead: 'تعيين الكل كمقروء',
    viewDetails: 'عرض التفاصيل'
  },
  en: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    thisMonth: 'This Month',
    totalEarnings: 'Total Earnings',
    completedJobs: 'Completed Jobs',
    rating: 'Rating',
    totalHours: 'Total Hours Worked',
    upcomingBookings: 'Upcoming Bookings',
    newRequests: 'New Requests',
    noRequests: 'No new requests',
    accept: 'Accept',
    decline: 'Decline',
    children: 'child',
    hours: 'hours',
    egp: 'EGP',
    atHome: 'At Home',
    outside: 'Outside',
    viewAll: 'View All',
    availability: 'Availability',
    available: 'Available',
    unavailable: 'Unavailable',
    toggleAvailability: 'Change Status',
    manageSchedule: 'Manage Schedule',
    scheduleDesc: 'Set your available days and times',
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    newBookingRequest: 'New booking request',
    bookingConfirmed: 'Booking confirmed',
    bookingCancelled: 'Booking cancelled',
    newReview: 'New review',
    minutesAgo: '{time} minutes ago',
    hoursAgo: '{time} hours ago',
    daysAgo: '{time} days ago',
    markAllRead: 'Mark all as read',
    viewDetails: 'View Details'
  }
};

export default function SitterHome({ language }: SitterHomeProps) {
  const t = translations[language];
  const [isAvailable, setIsAvailable] = useState(true);
  const [showAvailabilityManagement, setShowAvailabilityManagement] = useState(false);
  const [showServicesManagement, setShowServicesManagement] = useState(false);
  const [showSitterVerification, setShowSitterVerification] = useState(false);
  const [showBookingRequests, setShowBookingRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      type: 'booking',
      title: language === 'ar' ? 'طلب حجز جديد' : 'New booking request',
      message: language === 'ar' ? 'لديك طلب حجز جديد من أمل محمود' : 'You have a new booking request from Amal Mahmoud',
      time: language === 'ar' ? 'منذ 5 دقائق' : '5 minutes ago',
      read: false,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    {
      id: 2,
      type: 'confirmed',
      title: language === 'ar' ? 'تم تأكيد الحجز' : 'Booking confirmed',
      message: language === 'ar' ? 'تم تأكيد حجزك مع سارة أحمد' : 'Your booking with Sarah Ahmed is confirmed',
      time: language === 'ar' ? 'منذ ساعة' : '1 hour ago',
      read: false,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    },
    {
      id: 3,
      type: 'review',
      title: language === 'ar' ? 'تقييم جديد' : 'New review',
      message: language === 'ar' ? 'حصلتِ على تقييم 5 نجوم من منى حسن' : 'You received a 5-star review from Mona Hassan',
      time: language === 'ar' ? 'منذ يومين' : '2 days ago',
      read: true,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    }
  ];

  const mockRequests: BookingRequest[] = [
  {
    id: 1,
    clientName: language === 'ar' ? 'أمل محمود' : 'Amal Mahmoud',
    clientImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    date: '2024-11-26',
    time: '14:00',
    duration: 3,
    location: language === 'ar' ? 'المنيا الجديدة' : 'New Minya',
    type: 'home',
    price: 240,
    children: 2,
    notes: language === 'ar' ? 'الأطفال لديهم حساسية من الفول السوداني' : 'Children have peanut allergy'
  },
  {
    id: 2,
    clientName: language === 'ar' ? 'هدى سعيد' : 'Hoda Said',
    clientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    date: '2024-11-27',
    time: '10:00',
    duration: 2,
    location: language === 'ar' ? 'المنيا' : 'Minya',
    type: 'outside',
    price: 160,
    children: 1
  }
];

  const handleAccept = (id: number) => {
    alert(language === 'ar' ? 'تم قبول الطلب!' : 'Request accepted!');
  };

  const handleDecline = (id: number) => {
    alert(language === 'ar' ? 'تم رفض الطلب' : 'Request declined');
  };

  if (showAvailabilityManagement) {
    return (
      <AvailabilityManagement 
        language={language} 
        onBack={() => setShowAvailabilityManagement(false)} 
      />
    );
  }

  if (showServicesManagement) {
    return (
      <ServicesManagement 
        language={language} 
        onBack={() => setShowServicesManagement(false)} 
      />
    );
  }

  if (showSitterVerification) {
    return (
      <SitterVerification 
        language={language} 
        onBack={() => setShowSitterVerification(false)} 
      />
    );
  }

  if (showBookingRequests) {
    return (
      <BookingRequests 
        language={language} 
        onBack={() => setShowBookingRequests(false)} 
      />
    );
  }

  if (selectedRequest) {
    return (
      <RequestDetails
        language={language}
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        onAccept={() => {
            handleAccept(selectedRequest.id);
            setSelectedRequest(null);
        }}
        onDecline={() => {
            handleDecline(selectedRequest.id);
            setSelectedRequest(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8 pt-4">
      {/* Header with Notifications */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-[#FB5E7A] mb-2">
              {t.welcome}, {language === 'ar' ? 'فاطمة' : 'Fatima'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{t.dashboard}</p>
          </div>

          {/* Notification Bell - Top Right (Left in RTL) */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative w-12 h-12 rounded-full bg-[#FB5E7A]/10 flex items-center justify-center hover:bg-[#FB5E7A]/20 transition-colors">
                <Bell className="w-6 h-6 text-[#FB5E7A]" />
                {/* Notification Badge */}
                {mockNotifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {mockNotifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align={language === 'ar' ? 'start' : 'end'}>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{t.notifications}</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    {t.markAllRead}
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-96">
                {mockNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t.noNotifications}</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {mockNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-[#FB5E7A]/5' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <img
                            src={notification.image}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-medium">{notification.title}</p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-[#FB5E7A] rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.totalEarnings}</p>
              <h2 className="text-[#FB5E7A] font-bold">3,240 {t.egp}</h2>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.completedJobs}</p>
              <h2 className="text-[#FB5E7A] font-bold">24</h2>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.totalHours}</p>
              <h2 className="text-[#FB5E7A] font-bold">156</h2>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-600">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.rating}</p>
              <h2 className="text-[#FB5E7A] font-bold flex items-center gap-1">
                4.8 <span className="text-xs text-gray-500 font-normal">(124)</span>
              </h2>
            </div>
          </div>
        </Card>
      </div>

      {/* New Requests */}
      <div className="mb-6">
        <h3 className="mb-4">{t.newRequests}</h3>
        {mockRequests.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            {t.noRequests}
          </Card>
        ) : (
          <div className="space-y-4">
            {mockRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={request.clientImage}
                    alt={request.clientName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{request.clientName}</h4>
                        <Badge variant="outline">
                          {request.children} {t.children}
                        </Badge>
                      </div>
                      <Badge className={request.type === 'home' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                        {request.type === 'home' ? t.atHome : t.outside}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{request.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{request.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{request.duration} {t.hours}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-[#FB5E7A]">{request.price} {t.egp}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedRequest(request)}
                        className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t.viewDetails}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}