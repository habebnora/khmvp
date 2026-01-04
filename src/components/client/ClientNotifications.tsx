import { useState, useEffect } from 'react';
import { Bell, Calendar, MessageCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { Language } from '../../App';
import { useAuthStore } from '../../stores/useAuthStore';
import { notificationService, type Notification } from '../../services/notification';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface ClientNotificationsProps {
  language: Language;
}

const translations = {
  ar: {
    notifications: 'الإشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    noNotifications: 'لا توجد إشعارات',
    now: 'الآن',
    today: 'اليوم',
    yesterday: 'أمس',
    new: 'جديد',
    error: 'حدث خطأ ما',
    success: 'تمت العملية'
  },
  en: {
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No notifications',
    now: 'now',
    today: 'today',
    yesterday: 'yesterday',
    new: 'New',
    error: 'Something went wrong',
    success: 'Operation successful'
  }
};

export default function ClientNotifications({ language }: ClientNotificationsProps) {
  const t = translations[language];
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    loadNotifications();

    // Subscribe to realtime notifications
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          // Optional: sound or local notification here
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const loadNotifications = async () => {
    try {
      if (!user?.id) return;
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error(error);
      toast.error(t.error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      if (!user?.id) return;
      await notificationService.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success(t.success);
    } catch (error) {
      console.error(error);
      toast.error(t.error);
    }
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking_update': return Calendar;
      case 'new_message': return MessageCircle;
      case 'system_alert': return AlertCircle;
      default: return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'booking_update': return 'text-blue-600';
      case 'new_message': return 'text-[#FB5E7A]';
      case 'system_alert': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${language === 'ar' ? 'دقيقة' : 'm'}`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} ${language === 'ar' ? 'ساعة' : 'h'}`;
    }

    // Older
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#FB5E7A]">{t.notifications}</h1>
        {notifications.some(n => !n.is_read) && (
          <Button onClick={handleMarkAllRead} variant="ghost" size="sm" className="text-[#FB5E7A]">
            {t.markAllRead}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {t.noNotifications}
          </div>
        ) : (
          notifications.map((notification) => {
            const IconComponent = getIcon(notification.type);
            return (
              <Card
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id, notification.is_read)}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${!notification.is_read ? 'bg-[#FFD1DA]/10 border-[#FB5E7A]/30' : ''
                  }`}
              >
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${getIconColor(notification.type)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-medium">{notification.title}</h3>
                      {!notification.is_read && (
                        <Badge className="bg-[#FB5E7A] text-white text-xs">
                          {t.new}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">{formatTime(notification.created_at)}</span>
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
