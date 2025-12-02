import { useState } from 'react';
import { ArrowRight, CheckCircle, Clock, MapPin, MessageCircle, Shield, User, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Language } from '../../App';

interface SitterSessionPageProps {
  language: Language;
  booking: {
    id: number;
    clientName: string;
    clientImage: string;
    date: string;
    time: string;
    duration: number;
    status: 'upcoming' | 'ongoing';
    location: string;
  };
  onBack: () => void;
}

const translations = {
  ar: {
    sessionManagement: 'إدارة الجلسة',
    client: 'العميل',
    status: 'الحالة',
    upcoming: 'قادمة',
    ongoing: 'جارية الآن',
    startService: 'بدء الخدمة',
    qrInstructions: 'اطلبي من العميل مسح الكود لبدء احتساب الوقت',
    sessionTimeline: 'جدول الجلسة',
    hour: 'ساعة',
    minute: 'دقيقة',
    safetyCheck: 'الاطمئنان الدوري',
    noRequests: 'لا توجد طلبات اطمئنان حالياً',
    incomingRequest: 'طلب اطمئنان جديد من العميل!',
    confirmSafety: 'تأكيد أن الطفل بخير',
    simulateRequest: 'محاكاة طلب استلام (تجريبي)',
    safetyConfirmed: 'تم تأكيد الاطمئنان بنجاح',
    contactClient: 'مراسلة العميل'
  },
  en: {
    sessionManagement: 'Session Management',
    client: 'Client',
    status: 'Status',
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    startService: 'Start Service',
    qrInstructions: 'Ask client to scan code to start timer',
    sessionTimeline: 'Session Timeline',
    hour: 'hour',
    minute: 'min',
    safetyCheck: 'Safety Check',
    noRequests: 'No active safety check requests',
    incomingRequest: 'New Safety Check Request!',
    confirmSafety: 'Confirm Child is Safe',
    simulateRequest: 'Simulate Incoming Request (Demo)',
    safetyConfirmed: 'Safety confirmed successfully',
    contactClient: 'Contact Client'
  }
};

export default function SitterSessionPage({ language, booking, onBack }: SitterSessionPageProps) {
  const t = translations[language];
  const [hasIncomingCheck, setHasIncomingCheck] = useState(false);
  
  // Mock progress for ongoing sessions
  const progress = booking.status === 'ongoing' ? 50 : 0;
  const timePoints = Array.from({ length: booking.duration + 1 }, (_, i) => i);

  const handleConfirmSafety = () => {
      alert(t.safetyConfirmed);
      setHasIncomingCheck(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowRight className={language === 'ar' ? '' : 'rotate-180'} />
          </Button>
          <h1 className="font-bold text-lg">{t.sessionManagement}</h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        
        {/* Client Info Card */}
        <Card className="p-4">
            <div className="flex justify-between items-start">
                <div className="flex gap-4">
                    <img 
                        src={booking.clientImage} 
                        alt={booking.clientName} 
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-bold">{booking.clientName}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            {booking.location}
                        </div>
                    </div>
                </div>
                <Button size="icon" variant="outline" className="rounded-full">
                    <MessageCircle className="w-4 h-4" />
                </Button>
            </div>
        </Card>

        {/* Status & Actions */}
        {booking.status === 'upcoming' ? (
            <Card className="p-6 flex flex-col items-center text-center space-y-4">
                <h3 className="font-bold text-lg">{t.startService}</h3>
                <p className="text-sm text-gray-500">{t.qrInstructions}</p>
                <div className="border-4 border-[#FB5E7A] p-2 rounded-xl bg-white inline-block">
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Booking-${booking.id}`}
                        alt="QR Code"
                        className="w-48 h-48"
                    />
                </div>
            </Card>
        ) : (
            <div className="space-y-6">
                {/* Safety Check Section */}
                <Card className={`p-4 border-2 transition-colors ${hasIncomingCheck ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-transparent'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            {t.safetyCheck}
                        </h3>
                        {hasIncomingCheck && (
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 right-8"></span>
                        )}
                    </div>

                    {hasIncomingCheck ? (
                        <div className="space-y-4 text-center">
                            <div className="flex flex-col items-center text-red-600 gap-2 animate-pulse">
                                <Bell className="w-8 h-8" />
                                <p className="font-bold">{t.incomingRequest}</p>
                            </div>
                            <Button 
                                className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                                onClick={handleConfirmSafety}
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {t.confirmSafety}
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <p className="text-gray-500 text-sm py-2">{t.noRequests}</p>
                            
                            {/* Demo Trigger Button (Hidden in production) */}
                            <div className="pt-8 border-t border-dashed mt-4">
                                <p className="text-xs text-gray-400 mb-2 text-center">
                                    {language === 'ar' ? '(أدوات العرض التجريبي)' : '(Demo Tools)'}
                                </p>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full border-dashed text-gray-500 hover:text-gray-700"
                                    onClick={() => setHasIncomingCheck(true)}
                                >
                                    <Bell className="w-3 h-3 mr-2" />
                                    {t.simulateRequest}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Timeline */}
                <Card className="p-6">
                    <h3 className="font-bold mb-4">{t.sessionTimeline}</h3>
                    <div className="relative pl-4 pr-4">
                        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200 rtl:right-2 rtl:left-auto"></div>
                        <div className="space-y-6">
                             {timePoints.map((point, index) => {
                                const isCompleted = (index / booking.duration) * 100 <= progress;
                                return (
                                    <div key={index} className="flex items-center gap-4 relative">
                                        <div className={`
                                            w-4 h-4 rounded-full z-10 
                                            ${isCompleted ? 'bg-[#FB5E7A]' : 'bg-gray-300'}
                                        `}></div>
                                        <span className={isCompleted ? 'text-black dark:text-white font-medium' : 'text-gray-400'}>
                                            {index === 0 ? 'Start' : `${index} ${t.hour}`}
                                        </span>
                                    </div>
                                );
                             })}
                        </div>
                    </div>
                </Card>
            </div>
        )}

      </div>
    </div>
  );
}