// Booking API Service
// Handles all booking-related operations

import apiClient from './client';
import type { CreateBookingDto } from '@/schemas';

export interface Booking {
    id: number;
    sitterId: number;
    clientId: number;
    serviceId: string;
    date: string;
    time: string;
    duration: number;
    children: number;
    location: string;
    type: 'home' | 'outside';
    status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
    price: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export const bookingService = {
    /**
     * Get all bookings for current user
     */
    getAll: async (): Promise<Booking[]> => {
        const response = await apiClient.get<{ bookings: Booking[] }>('/bookings');
        return response.data.bookings;
    },

    /**
     * Get booking by ID
     */
    getById: async (id: number): Promise<Booking> => {
        const response = await apiClient.get<{ booking: Booking }>(`/bookings/${id}`);
        return response.data.booking;
    },

    /**
     * Create new booking
     */
    create: async (data: CreateBookingDto): Promise<Booking> => {
        const response = await apiClient.post<{ booking: Booking }>('/bookings', data);
        return response.data.booking;
    },

    /**
     * Update booking
     */
    update: async (id: number, data: Partial<CreateBookingDto>): Promise<Booking> => {
        const response = await apiClient.patch<{ booking: Booking }>(`/bookings/${id}`, data);
        return response.data.booking;
    },

    /**
     * Cancel booking
     */
    cancel: async (id: number, reason?: string): Promise<{ success: boolean }> => {
        const response = await apiClient.post(`/bookings/${id}/cancel`, { reason });
        return response.data;
    },

    /**
     * Accept booking (sitter)
     */
    accept: async (id: number): Promise<{ success: boolean }> => {
        const response = await apiClient.post(`/bookings/${id}/accept`);
        return response.data;
    },

    /**
     * Reject booking (sitter)
     */
    reject: async (id: number, reason?: string): Promise<{ success: boolean }> => {
        const response = await apiClient.post(`/bookings/${id}/reject`, { reason });
        return response.data;
    },

    /**
     * Start booking (sitter)
     */
    start: async (id: number): Promise<{ success: boolean }> => {
        const response = await apiClient.post(`/bookings/${id}/start`);
        return response.data;
    },

    /**
     * Complete booking (sitter)
     */
    complete: async (id: number, report?: any): Promise<{ success: boolean }> => {
        const response = await apiClient.post(`/bookings/${id}/complete`, { report });
        return response.data;
    },

    /**
     * Rate booking (client)
     */
    rate: async (id: number, rating: any): Promise<{ success: boolean }> => {
        const response = await apiClient.post(`/bookings/${id}/rate`, rating);
        return response.data;
    },
};
