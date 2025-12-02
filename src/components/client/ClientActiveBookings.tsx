import { useState } from 'react';
import { Calendar, Clock, MapPin, MessageCircle, QrCode, CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import ChatPage from './ChatPage';
import TrackingPage from './TrackingPage';
import type { Language } from '../../App';

interface ClientActiveBookingsProps {
  language: Language;
}

interface Booking {
  id: number;
  sitterName: string;
  sitterImage: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  type: 'home' | 'outside';
  status: 'confirmed' | 'ongoing';
  price: number;
}

const translations = {
  ar: {
    mySchedule: 'مواعيدي',
    ongoing: 'جارية الآن',
    confirmed: 'مؤكدة (قادمة)',
    date: 'التاريخ',
    time: 'الوقت',
    duration: 'المدة',
    hours: 'ساعات',
    atHome: 'في المنزل',
    outside: 'خارج المنزل',
    total: 'الإجمالي',
    egp: 'جنيه',
    contact: 'تواصل',
    call: 'اتصال',
    message: 'رسالة',
    noActiveBookings: 'لا توجد مواعيد مؤكدة حالياً',
    trackBooking: 'متابعة الطلب',
    scanQR: 'مسح الكود',
    scanTitle: 'تأكيد هوية الخالة',
    scanDesc: 'وجهي الكاميرا نحو كود QR الخاص بالخالة لتأكيد بدء الخدمة',
    simulateScan: 'محاكاة المسح (تجريبي)',
    scanSuccess: 'تم تأكيد الهوية وبدء الخدمة بنجاح!',
  },
  en: {
    mySchedule: 'My Schedule',
    ongoing: 'Ongoing',
    confirmed: 'Confirmed (Upcoming)',
    date: 'Date',
    time: 'Time',
    duration: 'Duration',
    hours: 'hours',
    atHome: 'At Home',
    outside: 'Outside',
    total: 'Total',
    egp: 'EGP',
    contact: 'Contact',
    call: 'Call',
    message: 'Message',
    noActiveBookings: 'No active bookings',
    trackBooking: 'Track Booking',
    scanQR: 'Scan QR',
    scanTitle: 'Verify Sitter Identity',
    scanDesc: 'Point camera at the Sitter\'s QR code to confirm and start service',
    simulateScan: 'Simulate Scan (Demo)',
    scanSuccess: 'Identity Verified! Service Started Successfully.',
  }
};

const initialMockActiveBookings: Booking[] = [
  {
    id: 1,
    sitterName: 'فاطمة أحمد',
    sitterImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    date: '2024-11-25',
    time: '10:00',
    duration: 3,
    location: 'المنيا الجديدة، شارع الجامعة',
    type: 'home',
    status: 'confirmed',
    price: 240
  },
  {
    id: 2,
    sitterName: 'نورهان محمد',
    sitterImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    date: '2024-11-25',
    time: '14:00',
    duration: 2,
    location: 'المنيا',
    type: 'outside',
    status: 'ongoing',
    price: 200
  }
];

export default function ClientActiveBookings({ language }: ClientActiveBookingsProps) {
  const [activeBookings, setActiveBookings] = useState<Booking[]>(initialMockActiveBookings);
  const [showChat, setShowChat] = useState(false);
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);
  
  const [showTracking, setShowTracking] = useState(false);
  const [trackingBooking, setTrackingBooking] = useState<Booking | null>(null);

  const [showScanner, setShowScanner] = useState(false);
  const [scanningBooking, setScanningBooking] = useState<Booking | null>(null);

  const t = translations[language];

  const getStatusBadge = (status: Booking['status']) => {
    const styles = {
      confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      ongoing: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 animate-pulse',
    };

    return (
      <Badge className={styles[status]}>
        {t[status]}
      </Badge>
    );
  };

  const handleScanSuccess = () => {
    if (scanningBooking) {
        setActiveBookings(prev => prev.map(b => b.id === scanningBooking.id ? {...b, status: 'ongoing'} : b));
        alert(t.scanSuccess);
        setShowScanner(false);
        // Optionally immediately open tracking or stay on list
    }
  };

  if (showChat && chatBooking) {
    return (
      <ChatPage 
        language={language}
        onBack={() => setShowChat(false)}
        recipientName={chatBooking.sitterName}
        recipientImage={chatBooking.sitterImage}
      />
    );
  }

  if (showTracking && trackingBooking) {
      return (
          <TrackingPage 
            language={language}
            booking={{
                ...trackingBooking,
                startTime: trackingBooking.time
            }}
            onBack={() => setShowTracking(false)}
          />
      );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      <h1 className="text-[#FB5E7A] mb-6">{t.mySchedule}</h1>

      {activeBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          {t.noActiveBookings}
        </div>
      ) : (
        <div className="space-y-4">
          {activeBookings.map((booking) => (
            <Card key={booking.id} className={`p-4 ${booking.status === 'ongoing' ? 'border-green-500 border-2' : ''}`}>
              <div className="flex gap-4">
                <img
                  src={booking.sitterImage}
                  alt={booking.sitterName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="mb-1">{language === 'ar' ? 'الخالة : ' : 'Khala : '}{booking.sitterName}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time} ({booking.duration} {t.hours})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline">
                        {booking.type === 'home' ? t.atHome : t.outside}
                      </Badge>
                      <div className="text-[#FB5E7A] mt-1 font-bold">
                        {booking.price} {t.egp}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-full w-10 h-10 p-0"
                        onClick={() => {
                            setChatBooking(booking);
                            setShowChat(true);
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>

                      {booking.status === 'confirmed' && (
                          <Button 
                            size="sm" 
                            className="rounded-full w-10 h-10 p-0 bg-[#FB5E7A] hover:bg-[#e5536e]"
                            onClick={() => {
                                setScanningBooking(booking);
                                setShowScanner(true);
                            }}
                          >
                            <QrCode className="w-4 h-4 text-white" />
                          </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {booking.status === 'ongoing' && (
                 <div className="mt-4 pt-4 border-t">
                    <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => {
                            setTrackingBooking(booking);
                            setShowTracking(true);
                        }}
                    >
                        {t.trackBooking}
                    </Button>
                 </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Scanner Modal */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
           <DialogContent>
               <DialogHeader>
                   <DialogTitle>{t.scanTitle}</DialogTitle>
               </DialogHeader>
               <div className="flex flex-col items-center gap-4 py-6">
                   <div className="w-64 h-64 bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                       {/* Camera UI Mock */}
                       <div className="absolute inset-0 border-2 border-[#FB5E7A] opacity-50 m-8"></div>
                       <p className="text-white text-sm text-center px-4">{t.scanDesc}</p>
                   </div>
                   <Button 
                     className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
                     onClick={handleScanSuccess}
                   >
                       <CheckCircle className="w-4 h-4 mr-2" />
                       {t.simulateScan}
                   </Button>
               </div>
           </DialogContent>
       </Dialog>
    </div>
  );
}