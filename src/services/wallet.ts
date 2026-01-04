import { supabase } from '@/lib/supabase';

export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    type: 'earning' | 'withdrawal';
    status: 'completed' | 'pending' | 'failed';
    description: string;
    booking_id?: string;
    created_at: string;
}

export const walletService = {
    async getTransactions(userId: string) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Transaction[];
    },

    async getBalance(userId: string) {
        const { data, error } = await supabase
            .rpc('get_user_balance', { uid: userId });

        if (error) throw error;
        return data as number;
    },

    async requestWithdrawal(userId: string, amount: number) {
        const { error } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                amount: amount,
                type: 'withdrawal',
                status: 'pending',
                description: `Withdrawal request`
            });

        if (error) throw error;
    },

    // Admin Methods
    async getAllPendingWithdrawals() {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                profiles:user_id (
                    full_name,
                    phone
                )
            `)
            .eq('type', 'withdrawal')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async updateTransactionStatus(id: string, status: Transaction['status']) {
        const { error } = await supabase
            .from('transactions')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }
};
