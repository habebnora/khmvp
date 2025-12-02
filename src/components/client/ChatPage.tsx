import { useState } from 'react';
import { ArrowLeft, ArrowRight, Send, Phone, MoreVertical, Image as ImageIcon, Mic } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';
import type { Language } from '../../App';

interface ChatPageProps {
  language: Language;
  onBack: () => void;
  recipientName?: string;
  recipientImage?: string;
}

const translations = {
  ar: {
    typeMessage: 'اكتب رسالة...',
    online: 'متصل الآن',
    send: 'إرسال'
  },
  en: {
    typeMessage: 'Type a message...',
    online: 'Online',
    send: 'Send'
  }
};

const mockMessages = [
  { id: 1, text: 'مرحباً، هل يمكنني الاستفسار عن موعد الحجز؟', sender: 'me', time: '10:30 AM' },
  { id: 2, text: 'أهلاً بك! تفضلي، أنا متاحة للإجابة.', sender: 'other', time: '10:32 AM' },
  { id: 3, text: 'هل يمكن تغيير الموعد لساعة مبكراً؟', sender: 'me', time: '10:33 AM' },
  { id: 4, text: 'نعم، لا توجد مشكلة. سأقوم بتعديل الموعد.', sender: 'other', time: '10:35 AM' },
];

export default function ChatPage({ language, onBack, recipientName = 'Sitter', recipientImage }: ChatPageProps) {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const t = translations[language];

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewMessage('');
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
            {t.online}
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
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-2xl ${
                msg.sender === 'me'
                  ? 'bg-[#FB5E7A] text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className={`text-[10px] mt-1 block ${
                msg.sender === 'me' ? 'text-white/80' : 'text-gray-400'
              }`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
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
            placeholder={t.typeMessage}
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