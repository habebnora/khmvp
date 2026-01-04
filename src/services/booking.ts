import { supabase } from '@/lib/supabase';

import { Booking } from '@/types/core';
export type { Booking };

export const bookingService = {
    // Create Booking
    async createBooking(booking: Partial<Booking>) {
        const { data, error } = await supabase
            .from('bookings')
            .insert(booking)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get Client Bookings
    async getClientBookings(clientId: string) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        sitter:sitter_id (
          full_name,
          avatar_url
        )
      `)
            .eq('client_id', clientId)
            .order('date', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get Sitter Bookings
    async getSitterBookings(sitterId: string) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        client:client_id (
          full_name,
          avatar_url
        )
      `)
            .eq('sitter_id', sitterId)
            .order('date', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Update Status
    async updateStatus(bookingId: string, status: Booking['status']) {
        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', bookingId);

        if (error) throw error;
    },

    // Get single booking
    async getBooking(bookingId: string) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                client:client_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('id', bookingId)
            .single();

        if (error) throw error;
        return data as Booking;
    }
};
