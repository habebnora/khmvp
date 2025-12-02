import { Bell, Calendar, Gift, MessageCircle, Check, DollarSign } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { Language } from '../../App';

interface SitterNotificationsProps {
  language: Language;
}

interface Notification {
  id: number;
  type: 'booking' | 'payment' | 'message' | 'offer' | 'rating';
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
    noNotifications: 'لا توجد إشعارات'
  },
  en: {
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No notifications'
  }
};

export default function SitterNotifications({ language }: SitterNotificationsProps) {
  const t = translations[language];

  const mockNotifications: Notification[] = [
    {
      id: 1,
      type: 'booking',
      title: language === 'ar' ? 'طلب حجز جديد' : 'New Booking Request',
      message: language === 'ar'
        ? 'أمل محمود أرسلت لك طلب حجز ليوم 26 نوفمبر'
        : 'Amal Mahmoud sent you a booking request for November 26',
      time: '5 دقائق',
      read: false,
      icon: Calendar
    },
    {
      id: 2,
      type: 'payment',
      title: language === 'ar' ? 'تم استلام الدفعة' : 'Payment Received',
      message: language === 'ar'
        ? 'تم إضافة 240 جنيه إلى رصيدك'
        : '240 EGP has been added to your balance',
      time: '30 دقيقة',
      read: false,
      icon: DollarSign
    },
    {
      id: 3,
      type: 'message',
      title: language === 'ar' ? 'رسالة جديدة' : 'New Message',
      message: language === 'ar'
        ? 'هدى سعيد أرسلت لك رسالة'
        : 'Hoda Said sent you a message',
      time: 'ساعة واحدة',
      read: true,
      icon: MessageCircle
    },
    {
      id: 4,
      type: 'rating',
      title: language === 'ar' ? 'تقييم جديد' : 'New Rating',
      message: language === 'ar'
        ? 'ريهام عادل قيمتك بـ 5 نجوم!'
        : 'Reham Adel rated you 5 stars!',
      time: '3 ساعات',
      read: true,
      icon: Check
    },
    {
      id: 5,
      type: 'offer',
      title: language === 'ar' ? 'نصيحة' : 'Tip',
      message: language === 'ar'
        ? 'كلما زادت استجابتك للطلبات، زاد ترتيبك في النتائج'
        : 'The more responsive you are to requests, the higher your ranking in results',
      time: 'أمس',
      read: true,
      icon: Gift
    },
    {
      id: 6,
      type: 'booking',
      title: language === 'ar' ? 'تذكير بالموعد' : 'Appointment Reminder',
      message: language === 'ar'
        ? 'لديك موعد غداً الساعة 10:00 صباحاً'
        : 'You have an appointment tomorrow at 10:00 AM',
      time: 'منذ يومين',
      read: true,
      icon: Bell
    }
  ];

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return 'text-blue-600';
      case 'payment':
        return 'text-green-600';
      case 'message':
        return 'text-[#FB5E7A]';
      case 'offer':
        return 'text-purple-600';
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
