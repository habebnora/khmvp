import { supabase } from '@/lib/supabase';

export interface SitterLocation {
    sitter_id: string;
    booking_id: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
}

export const locationService = {
    async updateLocation(location: SitterLocation) {
        const { error } = await supabase
            .from('sitter_locations')
            .insert(location);

        if (error) throw error;
    },

    async getSitterPath(bookingId: string) {
        const { data, error } = await supabase
            .from('sitter_locations')
            .select('*')
            .eq('booking_id', bookingId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    async getLatestLocation(bookingId: string) {
        const { data, error } = await supabase
            .from('sitter_locations')
            .select('*')
            .eq('booking_id', bookingId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        return data;
    }
};
