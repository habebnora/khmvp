import { Bell, Calendar, Gift, MessageCircle, Check, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { Language } from '../../App';

interface ClientNotificationsProps {
  language: Language;
}

interface Notification {
  id: number;
  type: 'booking' | 'message' | 'offer' | 'reminder' | 'rating';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
}

const translations = {
  ar: {
    notifications: 'الإشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    noNotifications: 'لا توجد إشعارات',
    now: 'الآن',
    today: 'اليوم',
    yesterday: 'أمس',
    hoursAgo: 'منذ ساعة',
    minutesAgo: 'منذ دقيقة',
    daysAgo: 'منذ يوم'
  },
  en: {
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No notifications',
    now: 'now',
    today: 'today',
    yesterday: 'yesterday',
    hoursAgo: 'hour ago',
    minutesAgo: 'minute ago',
    daysAgo: 'day ago'
  }
};

export default function ClientNotifications({ language }: ClientNotificationsProps) {
  const t = translations[language];

  const mockNotifications: Notification[] = [
    {
      id: 1,
      type: 'booking',
      title: language === 'ar' ? 'تم تأكيد الحجز' : 'Booking Confirmed',
      message: language === 'ar' 
        ? 'تم تأكيد حجزك مع فاطمة أحمد ليوم 25 نوفمبر الساعة 10:00 صباحاً'
        : 'Your booking with Fatima Ahmed for November 25 at 10:00 AM has been confirmed',
      time: '10 دقائق',
      read: false,
      icon: Check
    },
    {
      id: 2,
      type: 'message',
      title: language === 'ar' ? 'رسالة جديدة' : 'New Message',
      message: language === 'ar'
        ? 'نورهان محمد أرسلت لك رسالة'
        : 'Nourhan Mohamed sent you a message',
      time: '30 دقيقة',
      read: false,
      icon: MessageCircle
    },
    {
      id: 3,
      type: 'reminder',
      title: language === 'ar' ? 'تذكير بالموعد' : 'Appointment Reminder',
      message: language === 'ar'
        ? 'لديك موعد غداً الساعة 2:00 مساءً مع نورهان محمد'
        : 'You have an appointment tomorrow at 2:00 PM with Nourhan Mohamed',
      time: 'ساعة واحدة',
      read: true,
      icon: Clock
    },
    {
      id: 4,
      type: 'offer',
      title: language === 'ar' ? 'عرض خاص' : 'Special Offer',
      message: language === 'ar'
        ? 'احصلي على خصم 20% على حجزك القادم!'
        : 'Get 20% off your next booking!',
      time: '3 ساعات',
      read: true,
      icon: Gift
    },
    {
      id: 5,
      type: 'rating',
      title: language === 'ar' ? 'تقييم الخدمة' : 'Rate Service',
      message: language === 'ar'
        ? 'كيف كانت تجربتك مع منى عبدالله؟'
        : 'How was your experience with Mona Abdullah?',
      time: 'أمس',
      read: true,
      icon: Bell
    },
    {
      id: 6,
      type: 'booking',
      title: language === 'ar' ? 'طلب حجز جديد' : 'New Booking Request',
      message: language === 'ar'
        ? 'ياسمين علي قبلت طلب حجزك'
        : 'Yasmine Ali accepted your booking request',
      time: 'منذ يومين',
      read: true,
      icon: Calendar
    }
  ];

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return 'text-blue-600';
      case 'message':
        return 'text-[#FB5E7A]';
      case 'offer':
        return 'text-purple-600';
      case 'reminder':
        return 'text-orange-600';
      case 'rating':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#FB5E7A]">{t.notifications}</h1>
        <Button variant="ghost" size="sm" className="text-[#FB5E7A]">
          {t.markAllRead}
        </Button>
      </div>

      <div className="space-y-2">
        {mockNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {t.noNotifications}
          </div>
        ) : (
          mockNotifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.read ? 'bg-[#FFD1DA]/10 border-[#FB5E7A]/30' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${getIconColor(notification.type)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm">{notification.title}</h3>
                      {!notification.read && (
                        <Badge className="bg-[#FB5E7A] text-white text-xs">
                          {language === 'ar' ? 'جديد' : 'New'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
