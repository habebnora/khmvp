import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Send, MoreVertical, Image as ImageIcon, Mic } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuthStore } from '../../stores/useAuthStore';
import { chatService, type ChatMessage } from '../../services/chat';
import { supabase } from '../../lib/supabase';
import { useTranslation } from '../../hooks/useTranslation';

interface ChatPageProps {
  onBack: () => void;
  bookingId: string;
  recipientId: string;
  recipientName?: string;
  recipientImage?: string;
}

export default function ChatPage({
  onBack,
  bookingId,
  recipientId,
  recipientName = 'User',
  recipientImage
}: ChatPageProps) {
  const { user } = useAuthStore();
  const { t, language } = useTranslation();
  const chatT = t.client.chatPage;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (bookingId && user?.id) {
      loadMessages();

      const subscription = chatService.subscribeToMessages(bookingId, (newMsg) => {
        setMessages(prev => {
          if (prev.some(m => m.id.toLowerCase() === newMsg.id.toLowerCase())) return prev;
          return [...prev, newMsg];
        });
        if (newMsg.receiver_id === user.id) {
          chatService.markAsRead(bookingId, user.id);
        }
      });

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [bookingId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      if (!bookingId) return;
      const data = await chatService.getMessages(bookingId);
      setMessages(data);
      if (user?.id) {
        await chatService.markAsRead(bookingId, user.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user?.id) return;

    const content = newMessage;
    setNewMessage('');

    try {
      const msg = await chatService.sendMessage(bookingId, user.id, recipientId, content);
      setMessages(prev => {
        if (prev.some(m => m.id.toLowerCase() === msg.id.toLowerCase())) return prev;
        return [...prev, msg];
      });
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </Button>

        <Avatar className="h-10 w-10 border">
          <AvatarImage src={recipientImage} />
          <AvatarFallback>{recipientName[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-semibold text-sm">{recipientName}</h3>
          <span className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {chatT.online}
          </span>
        </div>

        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-2xl ${msg.sender_id === user?.id
                ? 'bg-[#FB5E7A] text-white rounded-br-none'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
                }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className={`text-[10px] mt-1 block ${msg.sender_id === user?.id ? 'text-white/80' : 'text-gray-400'
                }`}>
                {formatTime(msg.created_at)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Mic className="w-5 h-5" />
          </Button>

          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={chatT.typeMessage}
            className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-full"
          />

          <Button
            onClick={handleSend}
            className="bg-[#FB5E7A] hover:bg-[#e5536e] rounded-full w-10 h-10 p-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}