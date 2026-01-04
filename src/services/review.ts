import { supabase } from '@/lib/supabase';

export interface Review {
    id: string;
    booking_id: string;
    reviewer_id: string;
    reviewee_id: string;
    rating: number;
    comment: string;
    created_at: string;
    // Joined data
    reviewer?: {
        full_name: string;
        avatar_url: string;
    };
    reviewee?: {
        full_name: string;
        avatar_url: string;
    };
}

export const reviewService = {
    // Create a review
    async createReview(review: {
        booking_id: string;
        reviewer_id: string;
        reviewee_id: string;
        rating: number;
        comment: string;
    }) {
        const { data, error } = await supabase
            .from('reviews')
            .insert(review)
            .select()
            .single();

        if (error) throw error;
        return data as Review;
    },

    // Get reviews for a specific sitter
    async getSitterReviews(sitterId: string) {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
        *,
        reviewer:reviewer_id (
          full_name,
          avatar_url
        )
      `)
            .eq('reviewee_id', sitterId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Review[];
    },

    // Get review for a specific booking
    async getBookingReview(bookingId: string) {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('booking_id', bookingId)
            .maybeSingle();

        if (error) throw error;
        return data as Review | null;
    },

    // Calculate average rating for a sitter
    async getSitterAverageRating(sitterId: string) {
        const { data, error } = await supabase
            .from('reviews')
            .select('rating')
            .eq('reviewee_id', sitterId);

        if (error) throw error;

        if (!data || data.length === 0) return { average: 0, count: 0 };

        const sum = data.reduce((acc, review) => acc + (review.rating || 0), 0);
        const average = sum / data.length;

        return {
            average: Math.round(average * 10) / 10, // Round to 1 decimal
            count: data.length
        };
    }
};
