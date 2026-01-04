import { supabase } from '@/lib/supabase';

import { SitterProfile, SitterAvailability } from '@/types/core';

export interface SitterService { // Keeping this as it's DB specific and slightly different from 'Service' view model, but could also be unified later
    id: string;
    service_type: string;
    price: number;
    description: string | null;
    minimum_hours: number;
    features: string[];
    is_active: boolean;
}

// ... existing code ...


export const sitterService = {
    // Profile
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data as SitterProfile;
    },

    async updateProfile(userId: string, updates: Partial<SitterProfile>) {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
    },

    async updateAvatar(userId: string, file: File) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/avatar-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        await this.updateProfile(userId, { avatar_url: data.publicUrl });
        return data.publicUrl;
    },

    // Services
    async getServices(userId: string) {
        const { data, error } = await supabase
            .from('sitter_services')
            .select('*')
            .eq('sitter_id', userId);

        if (error) throw error;
        return data as SitterService[];
    },

    async upsertService(userId: string, serviceType: string, price: number, description?: string, minHours: number = 1, features: string[] = [], isActive: boolean = true) {
        // Check if exists first to update or insert
        const { data: existing } = await supabase
            .from('sitter_services')
            .select('id')
            .eq('sitter_id', userId)
            .eq('service_type', serviceType)
            .single();

        if (existing) {
            const { error } = await supabase
                .from('sitter_services')
                .update({
                    price,
                    description,
                    minimum_hours: minHours,
                    features: JSON.stringify(features),
                    is_active: isActive
                })
                .eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('sitter_services')
                .insert({
                    sitter_id: userId,
                    service_type: serviceType,
                    price,
                    description,
                    minimum_hours: minHours,
                    features: JSON.stringify(features),
                    is_active: isActive
                });
            if (error) throw error;
        }
    },

    // Skills
    async getSkills(userId: string) {
        const { data, error } = await supabase
            .from('sitter_skills')
            .select('*')
            .eq('sitter_id', userId);

        if (error) throw error;
        return data;
    },

    async addSkill(userId: string, skill: string) {
        const { error } = await supabase
            .from('sitter_skills')
            .insert({ sitter_id: userId, skill });

        if (error) throw error;
    },

    async removeSkill(id: string) {
        const { error } = await supabase
            .from('sitter_skills')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Languages
    async getLanguages(userId: string) {
        const { data, error } = await supabase
            .from('sitter_languages')
            .select('*')
            .eq('sitter_id', userId);

        if (error) throw error;
        return data;
    },

    async addLanguage(userId: string, language: string) {
        const { error } = await supabase
            .from('sitter_languages')
            .insert({ sitter_id: userId, language });

        if (error) throw error;
    },

    async removeLanguage(id: string) {
        const { error } = await supabase
            .from('sitter_languages')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get All Sitters (for Client Home)
    async getAllSitters() {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
        id,
        full_name,
        avatar_url,
        bio,
        location,
        experience_years,
        availability_type,
        is_verified,
        is_active,
        sitter_services (*),
        sitter_skills (*),
        sitter_languages (*)
      `)
            .eq('role', 'khala')
            .eq('is_verified', true)
            .eq('is_active', true); // Only show active sitters

        if (error) throw error;
        return data as unknown as SitterProfile[];
    },

    // Availability
    async getAvailability(userId: string) {
        const { data, error } = await supabase
            .from('sitter_availability')
            .select('*')
            .eq('sitter_id', userId);

        if (error) throw error;
        return data as SitterAvailability[];
    },

    // Save a batch of slots (Insert)
    async addAvailability(userId: string, slots: Omit<SitterAvailability, 'id' | 'created_at' | 'sitter_id'>[]) {
        const { error } = await supabase
            .from('sitter_availability')
            .insert(slots.map(s => ({ ...s, sitter_id: userId })));

        if (error) throw error;
    },

    // Delete specific slot
    async deleteAvailability(id: string) {
        const { error } = await supabase
            .from('sitter_availability')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Clear availability for specific dates (useful before re-inserting to avoid dupes)
    async clearAvailabilityForDates(userId: string, dates: string[]) {
        if (dates.length === 0) return;
        const { error } = await supabase
            .from('sitter_availability')
            .delete()
            .eq('sitter_id', userId)
            .in('date', dates)
            .eq('is_recurring', false);

        if (error) throw error;
    },

    async uploadVerificationDocument(userId: string, file: File, path: string) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${path}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('verification-docs')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('verification-docs')
            .getPublicUrl(fileName);

        return data.publicUrl;
    },

    async submitVerificationRequest(userId: string, documentType: string, documentUrl: string) {
        // Check if a request for this doc type already exists, if so update it
        const { data: existing } = await supabase
            .from('verification_requests')
            .select('id')
            .eq('sitter_id', userId)
            .eq('document_type', documentType)
            .single();

        if (existing) {
            const { error } = await supabase
                .from('verification_requests')
                .update({
                    document_url: documentUrl,
                    status: 'pending',
                    created_at: new Date().toISOString()
                })
                .eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('verification_requests')
                .insert({
                    sitter_id: userId,
                    document_type: documentType,
                    document_url: documentUrl,
                    status: 'pending'
                });
            if (error) throw error;
        }
    },

    async getVerificationRequests(userId: string) {
        const { data, error } = await supabase
            .from('verification_requests')
            .select('*')
            .eq('sitter_id', userId);

        if (error) throw error;
        return data as VerificationRequest[];
    },

    // Search Sitters via RPC
    async searchSitters(params: {
        minPrice?: number;
        maxPrice?: number;
        minExperience?: number;
        serviceType?: string;
        isVerified?: boolean;
    }) {
        const { data, error } = await supabase.rpc('search_sitters', {
            p_min_price: params.minPrice,
            p_max_price: params.maxPrice,
            p_min_experience: params.minExperience,
            p_service_type: params.serviceType,
            p_is_verified: params.isVerified
        });

        if (error) throw error;
        return data;
    },

    async getStats(userId: string) {
        const { data, error } = await supabase.rpc('get_sitter_stats', {
            p_sitter_id: userId
        });

        if (error) throw error;
        return data;
    }
};


export interface VerificationRequest {
    id: string;
    sitter_id: string;
    document_type: string;
    document_url: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}


