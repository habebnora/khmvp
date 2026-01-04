import { supabase } from '@/lib/supabase';

export interface ChatMessage {
    id: string;
    booking_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
    read_at: string | null;
}

export const chatService = {
    async getMessages(bookingId: string) {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('booking_id', bookingId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as ChatMessage[];
    },

    async sendMessage(bookingId: string, senderId: string, receiverId: string, content: string) {
        const { data, error } = await supabase
            .from('chat_messages')
            .insert({
                booking_id: bookingId,
                sender_id: senderId,
                receiver_id: receiverId,
                content: content
            })
            .select()
            .single();

        if (error) throw error;
        return data as ChatMessage;
    },

    async markAsRead(bookingId: string, userId: string) {
        // userId here is the current user (receiver), so we mark messages where receiver_id = userId
        const { error } = await supabase
            .from('chat_messages')
            .update({ read_at: new Date().toISOString() })
            .eq('booking_id', bookingId)
            .eq('receiver_id', userId)
            .is('read_at', null);

        if (error) throw error;
    },

    subscribeToMessages(bookingId: string, callback: (payload: ChatMessage) => void) {
        return supabase
            .channel(`chat_messages_channel_${bookingId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages'
                },
                (payload) => {
                    const newMessage = payload.new as ChatMessage;
                    if (newMessage.booking_id.toLowerCase() === bookingId.toLowerCase()) {
                        callback(newMessage);
                    }
                }
            )
            .subscribe();
    }
};
