// Booking Store
// Manages bookings state and operations

import { create } from 'zustand';
import type { Booking } from '@/services/api/bookingService';

interface BookingState {
    // State
    bookings: Booking[];
    selectedBooking: Booking | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setBookings: (bookings: Booking[]) => void;
    addBooking: (booking: Booking) => void;
    updateBooking: (id: number, updates: Partial<Booking>) => void;
    removeBooking: (id: number) => void;
    setSelectedBooking: (booking: Booking | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    // Filters
    getBookingsByStatus: (status: Booking['status']) => Booking[];
    getPendingBookings: () => Booking[];
    getUpcomingBookings: () => Booking[];
    getCompletedBookings: () => Booking[];
}

export const useBookingStore = create<BookingState>((set, get) => ({
    // Initial state
    bookings: [],
    selectedBooking: null,
    isLoading: false,
    error: null,

    // Set all bookings
    setBookings: (bookings) => set({ bookings }),

    // Add new booking
    addBooking: (booking) =>
        set((state) => ({
            bookings: [...state.bookings, booking]
        })),

    // Update existing booking
    updateBooking: (id, updates) =>
        set((state) => ({
            bookings: state.bookings.map((booking) =>
                booking.id === id ? { ...booking, ...updates } : booking
            ),
        })),

    // Remove booking
    removeBooking: (id) =>
        set((state) => ({
            bookings: state.bookings.filter((booking) => booking.id !== id),
        })),

    // Set selected booking
    setSelectedBooking: (booking) => set({ selectedBooking: booking }),

    // Set loading state
    setLoading: (isLoading) => set({ isLoading }),

    // Set error
    setError: (error) => set({ error }),

    // Clear error
    clearError: () => set({ error: null }),

    // Get bookings by status
    getBookingsByStatus: (status) => {
        return get().bookings.filter((booking) => booking.status === status);
    },

    // Get pending bookings
    getPendingBookings: () => {
        return get().bookings.filter((booking) => booking.status === 'pending');
    },

    // Get upcoming bookings
    getUpcomingBookings: () => {
        return get().bookings.filter(
            (booking) =>
                booking.status === 'accepted' || booking.status === 'ongoing'
        );
    },

    // Get completed bookings
    getCompletedBookings: () => {
        return get().bookings.filter((booking) => booking.status === 'completed');
    },
}));
