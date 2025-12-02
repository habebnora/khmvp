import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Clock, MapPin, Phone, Shield, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Language } from '../../App';
import { toast } from "sonner"; // Using sonner directly is better if available, or window.alert for simplicity if context missing

interface TrackingPageProps {
  language: Language;
  booking: {
    id: number;
    sitterName: string;
    sitterImage: string;
    startTime: string; // Format "HH:MM"
    duration: number; // In hours
    status: 'ongoing' | 'confirmed';
  };
  onBack: () => void;
}

const translations = {
  ar: {
    trackingTitle: 'متابعة الجلسة',
    sessionStarted: 'بدأت الجلسة',
    sessionEnds: 'نهاية الجلسة',
    timeLeft: 'الوقت المتبقي',
    hour: 'ساعة',
    minute: 'دقيقة',
    currentStage: 'المرحلة الحالية',
    safetyCheck: 'الاطمئنان الدوري',
    safetyCheckSent: 'تم إرسال طلب الاطمئنان للخالة...',
    safetyCheckConfirmed: 'تم الاطمئنان: الخالة تؤكد أن كل شيء بخير ✅',
    waitingResponse: 'بانتظار رد الخالة...',
    contactSitter: 'مراسلة الخالة',
    emergency: 'طوارئ',
    back: 'عودة',
    step: 'الساعة',
    verified: 'تم التحقق'
  },
  en: {
    trackingTitle: 'Session Tracking',
    sessionStarted: 'Session Started',
    sessionEnds: 'Session Ends',
    timeLeft: 'Time Left',
    hour: 'hour',
    minute: 'min',
    currentStage: 'Current Stage',
    safetyCheck: 'Safety Check',
    safetyCheckSent: 'Safety check sent to sitter...',
    safetyCheckConfirmed: 'Safety Check: Sitter confirmed everything is OK ✅',
    waitingResponse: 'Waiting for response...',
    contactSitter: 'Message Sitter',
    emergency: 'Emergency',
    back: 'Back',
    step: 'Hour',
    verified: 'Verified'
  }
};

export default function TrackingPage({ language, booking, onBack }: TrackingPageProps) {
  const t = translations[language];
  const [checkStatus, setCheckStatus] = useState<'idle' | 'sending' | 'confirmed'>('idle');
  
  // محاكاة للوقت الحالي (لغرض العرض، سنفترض أننا في منتصف الجلسة)
  const currentProgressPercent = 50; // 50% completed
  
  // توليد نقاط الوقت بناءً على المدة
  const timePoints = Array.from({ length: booking.duration + 1 }, (_, i) => i);

  const handleSafetyCheck = () => {
      if (checkStatus !== 'idle') return;

      // 1. Send Request
      setCheckStatus('sending');
      // alert(t.safetyCheckSent); 

      // 2. Simulate Sitter Response after 3 seconds
      setTimeout(() => {
          setCheckStatus('confirmed');
          alert(t.safetyCheckConfirmed);
          
          // Reset after a while so they can check again
          setTimeout(() => {
              setCheckStatus('idle');
          }, 5000);
      }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowRight className={language === 'ar' ? '' : 'rotate-180'} />
          </Button>
          <h1 className="font-bold text-lg">{t.trackingTitle}</h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        
        {/* Info Card */}
        <Card className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <img 
                src={booking.sitterImage} 
                alt={booking.sitterName} 
                className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full">
                <Shield className="w-3 h-3" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg">{booking.sitterName}</h3>
              <Badge className="bg-green-100 text-green-700 mt-1">
                {t.sessionStarted} {booking.startTime}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Timeline Visualization */}
        <Card className="p-6">
            <div className="relative pl-4 pr-4">
                {/* Progress Bar Background (Line) */}
                <div className="absolute left-8 top-2 bottom-2 w-1 bg-gray-200 rounded-full rtl:right-8 rtl:left-auto"></div>
                
                {/* Active Progress Line (Dynamic Height) */}
                <div 
                    className="absolute left-8 top-2 w-1 bg-[#FB5E7A] rounded-full transition-all duration-1000 rtl:right-8 rtl:left-auto"
                    style={{ height: `${currentProgressPercent}%` }}
                ></div>

                {/* Time Points */}
                <div className="space-y-8 relative">
                    {timePoints.map((point, index) => {
                        // Determine if this point is passed, current, or future
                        const progressStep = (index / booking.duration) * 100;
                        const isCompleted = progressStep < currentProgressPercent;
                        const isCurrent = Math.abs(progressStep - currentProgressPercent) < (100 / booking.duration / 2);
                        
                        return (
                            <div key={index} className="flex items-center gap-4 relative z-10">
                                {/* Dot/Icon */}
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center border-2 
                                    ${isCompleted || isCurrent ? 'bg-[#FB5E7A] border-[#FB5E7A] text-white' : 'bg-white border-gray-300 text-gray-300'}
                                    ${isCurrent ? 'ring-4 ring-[#FB5E7A]/20 animate-pulse' : ''}
                                `}>
                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>

                                {/* Text Info */}
                                <div className="flex-1">
                                    <p className={`font-medium ${isCompleted || isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                        {index === 0 ? t.sessionStarted : 
                                         index === booking.duration ? t.sessionEnds : 
                                         `${t.step} ${index}`}
                                    </p>
                                    {isCurrent && (
                                        <p className="text-xs text-[#FB5E7A] font-medium">
                                            {t.currentStage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Moving Indicator (Truck/Baby Icon substitute) */}
                     <div 
                        className="absolute left-6 w-6 h-6 bg-white border-2 border-[#FB5E7A] rounded-full flex items-center justify-center shadow-md transition-all duration-1000 rtl:right-6 rtl:left-auto z-20"
                        style={{ top: `calc(${currentProgressPercent}% - 12px)` }}
                    >
                        <div className="w-2 h-2 bg-[#FB5E7A] rounded-full animate-ping"></div>
                     </div>
                </div>
            </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
            <Button 
                variant={checkStatus === 'confirmed' ? 'default' : 'outline'}
                className={`h-auto py-4 flex flex-col gap-2 ${checkStatus === 'confirmed' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                onClick={handleSafetyCheck}
                disabled={checkStatus === 'sending'}
            >
                {checkStatus === 'sending' ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#FB5E7A]" />
                ) : checkStatus === 'confirmed' ? (
                    <CheckCircle className="w-6 h-6" />
                ) : (
                    <Shield className="w-6 h-6 text-green-600" />
                )}
                
                <span>
                    {checkStatus === 'sending' ? t.waitingResponse : 
                     checkStatus === 'confirmed' ? t.verified : t.safetyCheck}
                </span>
            </Button>
            
            <Button variant="destructive" className="h-auto py-4 flex flex-col gap-2 opacity-80 hover:opacity-100">
                <Phone className="w-6 h-6" />
                <span>{t.emergency}</span>
            </Button>
        </div>
        
        {checkStatus === 'sending' && (
             <p className="text-center text-sm text-gray-500 animate-pulse">{t.safetyCheckSent}</p>
        )}

      </div>
    </div>
  );
}