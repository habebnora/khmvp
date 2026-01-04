import { supabase } from '@/lib/supabase';

import { Child } from '@/types/core';

export const childrenService = {
    // Get all children for a client
    async getChildren(clientId: string) {
        const { data, error } = await supabase
            .from('children')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Child[];
    },

    // Add a child
    async addChild(child: Omit<Child, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('children')
            .insert(child)
            .select()
            .single();

        if (error) throw error;
        return data as Child;
    },

    // Update a child
    async updateChild(id: string, updates: Partial<Omit<Child, 'id' | 'client_id' | 'created_at'>>) {
        const { data, error } = await supabase
            .from('children')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Child;
    },

    // Delete a child
    async deleteChild(id: string) {
        const { error } = await supabase
            .from('children')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
