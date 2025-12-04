// Sitter API Service
// Handles sitter-related operations

import apiClient from './client';

export interface Sitter {
    id: number;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    experience: number;
    location: string;
    available: boolean;
    availabilityType: 'home' | 'outside' | 'both';
    languages: string[];
    specialties: string[];
    services: Service[];
}

export interface Service {
    id: string;
    name: string;
    description: string;
    pricePerHour: number;
    minHours?: number;
}

export const sitterService = {
    /**
     * Get all sitters
     */
    getAll: async (filters?: {
        location?: string;
        minRating?: number;
        availabilityType?: string;
        specialties?: string[];
    }): Promise<Sitter[]> => {
        const response = await apiClient.get<{ sitters: Sitter[] }>('/sitters', {
            params: filters,
        });
        return response.data.sitters;
    },

    /**
     * Get sitter by ID
     */
    getById: async (id: number): Promise<Sitter> => {
        const response = await apiClient.get<{ sitter: Sitter }>(`/sitters/${id}`);
        return response.data.sitter;
    },

    /**
     * Search sitters
     */
    search: async (query: string): Promise<Sitter[]> => {
        const response = await apiClient.get<{ sitters: Sitter[] }>('/sitters/search', {
            params: { q: query },
        });
        return response.data.sitters;
    },

    /**
     * Get sitter availability
     */
    getAvailability: async (sitterId: number, date: string): Promise<string[]> => {
        const response = await apiClient.get<{ slots: string[] }>(
            `/sitters/${sitterId}/availability`,
            { params: { date } }
        );
        return response.data.slots;
    },

    /**
     * Get sitter reviews
     */
    getReviews: async (sitterId: number): Promise<any[]> => {
        const response = await apiClient.get<{ reviews: any[] }>(
            `/sitters/${sitterId}/reviews`
        );
        return response.data.reviews;
    },
};
