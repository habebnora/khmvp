// Enhanced Notification Center Component
// This replaces the simple notification popover with a more advanced system

import { useState } from 'react';
import { Bell, Check, X, Filter, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { NotificationSkeleton } from '../ui/skeleton';
import type { Language } from '../../App';

export type NotificationType = 'booking' | 'message' | 'offer' | 'reminder' | 'rating' | 'payment';
export type NotificationPriority = 'urgent' | 'important' | 'info';

export interface Notification {
    id: number;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: any;
    image?: string;
    actionUrl?: string;
}

interface NotificationCenterProps {
    language: Language;
    notifications: Notification[];
    isLoading?: boolean;
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
    onDelete: (id: number) => void;
    onClearAll: () => void;
}

const translations = {
    ar: {
        notifications: 'الإشعارات',
        markAllRead: 'تحديد الكل كمقروء',
        clearAll: 'مسح الكل',
        noNotifications: 'لا توجد إشعارات',
        search: 'بحث في الإشعارات',
        all: 'الكل',
        urgent: 'عاجل',
        important: 'مهم',
        info: 'معلومات',
        unread: 'غير مقروءة',
    },
    en: {
        notifications: 'Notifications',
        markAllRead: 'Mark all as read',
        clearAll: 'Clear all',
        noNotifications: 'No notifications',
        search: 'Search notifications',
        all: 'All',
        urgent: 'Urgent',
        important: 'Important',
        info: 'Info',
        unread: 'Unread',
    },
};

export default function NotificationCenter({
    language,
    notifications,
    isLoading = false,
    onMarkAsRead,
    onMarkAllAsRead,
    onDelete,
    onClearAll,
}: NotificationCenterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState<NotificationPriority | 'all'>('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const t = translations[language];

    const unreadCount = notifications.filter(n => !n.read).length;

    // Filter notifications
    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch =
            notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
        const matchesRead = !showUnreadOnly || !notification.read;

        return matchesSearch && matchesPriority && matchesRead;
    });

    // Group by priority
    const urgentNotifications = filteredNotifications.filter(n => n.priority === 'urgent');
    const importantNotifications = filteredNotifications.filter(n => n.priority === 'important');
    const infoNotifications = filteredNotifications.filter(n => n.priority === 'info');

    const getPriorityColor = (priority: NotificationPriority) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-500';
            case 'important':
                return 'bg-orange-500';
            case 'info':
                return 'bg-blue-500';
        }
    };

    const renderNotification = (notification: Notification) => {
        const IconComponent = notification.icon;

        return (
            <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${!notification.read ? 'bg-[#FB5E7A]/5' : ''
                    }`}
                onClick={() => !notification.read && onMarkAsRead(notification.id)}
            >
                <div className="flex gap-3">
                    {/* Icon/Image */}
                    {notification.image ? (
                        <img
                            src={notification.image}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-[#FB5E7A]" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium truncate">{notification.title}</p>
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                            </div>
                            {!notification.read && (
                                <div className="w-2 h-2 bg-[#FB5E7A] rounded-full flex-shrink-0 mt-1" />
                            )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                            {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{notification.time}</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(notification.id);
                                }}
                                className="h-6 px-2 text-xs"
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="relative w-12 h-12 rounded-full bg-[#FB5E7A]/10 flex items-center justify-center hover:bg-[#FB5E7A]/20 transition-colors">
                    <Bell className="w-6 h-6 text-[#FB5E7A]" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent
                className="w-96 p-0"
                align={language === 'ar' ? 'start' : 'end'}
                side="bottom"
            >
                {/* Header */}
                <div className="p-4 border-b space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{t.notifications}</h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={onMarkAllAsRead}
                                >
                                    <Check className="w-3 h-3 mr-1" />
                                    {t.markAllRead}
                                </Button>
                            )}
                            {notifications.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-7 text-red-600"
                                    onClick={onClearAll}
                                >
                                    {t.clearAll}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder={t.search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-8 text-sm"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant={showUnreadOnly ? 'default' : 'outline'}
                            size="sm"
                            className={`h-7 text-xs ${showUnreadOnly ? 'bg-[#FB5E7A] hover:bg-[#e5536e]' : ''}`}
                            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                        >
                            {t.unread} {unreadCount > 0 && `(${unreadCount})`}
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full grid grid-cols-4 h-10">
                        <TabsTrigger value="all" className="text-xs">{t.all}</TabsTrigger>
                        <TabsTrigger value="urgent" className="text-xs">
                            {t.urgent}
                            {urgentNotifications.length > 0 && (
                                <Badge variant="destructive" className="ml-1 h-4 px-1 text-xs">
                                    {urgentNotifications.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="important" className="text-xs">{t.important}</TabsTrigger>
                        <TabsTrigger value="info" className="text-xs">{t.info}</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-96">
                        {isLoading ? (
                            <div>
                                <NotificationSkeleton />
                                <NotificationSkeleton />
                                <NotificationSkeleton />
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">{t.noNotifications}</p>
                            </div>
                        ) : (
                            <>
                                <TabsContent value="all" className="m-0">
                                    {filteredNotifications.map(renderNotification)}
                                </TabsContent>
                                <TabsContent value="urgent" className="m-0">
                                    {urgentNotifications.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <p className="text-sm">{t.noNotifications}</p>
                                        </div>
                                    ) : (
                                        urgentNotifications.map(renderNotification)
                                    )}
                                </TabsContent>
                                <TabsContent value="important" className="m-0">
                                    {importantNotifications.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <p className="text-sm">{t.noNotifications}</p>
                                        </div>
                                    ) : (
                                        importantNotifications.map(renderNotification)
                                    )}
                                </TabsContent>
                                <TabsContent value="info" className="m-0">
                                    {infoNotifications.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <p className="text-sm">{t.noNotifications}</p>
                                        </div>
                                    ) : (
                                        infoNotifications.map(renderNotification)
                                    )}
                                </TabsContent>
                            </>
                        )}
                    </ScrollArea>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
