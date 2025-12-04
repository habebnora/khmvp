// Notification Store
// Manages notifications state

import { create } from 'zustand';

export type NotificationType = 'booking' | 'payment' | 'message' | 'system';
export type NotificationPriority = 'urgent' | 'important' | 'info';

export interface Notification {
    id: number;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    read: boolean;
    timestamp: Date;
    actionUrl?: string;
}

interface NotificationState {
    // State
    notifications: Notification[];
    unreadCount: number;

    // Actions
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: number) => void;
    clearAll: () => void;

    // Filters
    getUnreadNotifications: () => Notification[];
    getNotificationsByType: (type: NotificationType) => Notification[];
    getNotificationsByPriority: (priority: NotificationPriority) => Notification[];
    getUrgentNotifications: () => Notification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    // Initial state
    notifications: [],
    unreadCount: 0,

    // Set all notifications
    setNotifications: (notifications) => {
        const unreadCount = notifications.filter((n) => !n.read).length;
        set({ notifications, unreadCount });
    },

    // Add new notification
    addNotification: (notification) =>
        set((state) => {
            const newNotifications = [notification, ...state.notifications];
            const unreadCount = newNotifications.filter((n) => !n.read).length;
            return {
                notifications: newNotifications,
                unreadCount,
            };
        }),

    // Mark notification as read
    markAsRead: (id) =>
        set((state) => {
            const notifications = state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            );
            const unreadCount = notifications.filter((n) => !n.read).length;
            return { notifications, unreadCount };
        }),

    // Mark all as read
    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
        })),

    // Delete notification
    deleteNotification: (id) =>
        set((state) => {
            const notifications = state.notifications.filter((n) => n.id !== id);
            const unreadCount = notifications.filter((n) => !n.read).length;
            return { notifications, unreadCount };
        }),

    // Clear all notifications
    clearAll: () => set({ notifications: [], unreadCount: 0 }),

    // Get unread notifications
    getUnreadNotifications: () => {
        return get().notifications.filter((n) => !n.read);
    },

    // Get notifications by type
    getNotificationsByType: (type) => {
        return get().notifications.filter((n) => n.type === type);
    },

    // Get notifications by priority
    getNotificationsByPriority: (priority) => {
        return get().notifications.filter((n) => n.priority === priority);
    },

    // Get urgent notifications
    getUrgentNotifications: () => {
        return get().notifications.filter((n) => n.priority === 'urgent' && !n.read);
    },
}));
