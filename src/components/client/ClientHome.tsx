import { useState } from 'react';
import { Search, Star, MapPin, Clock, Bell, Check, MessageCircle, Gift, Calendar } from 'lucide-react';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import SitterProfile from './SitterProfile';
import type { Language } from '../../App';

interface ClientHomeProps {
  language: Language;
}

interface Service {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  minHours?: number;
}

interface Sitter {
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

interface Notification {
  id: number;
  type: 'booking' | 'message' | 'offer' | 'reminder' | 'rating';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
}

const translations = {
  ar: {
    searchPlaceholder: 'ابحثي عن خالة...',
    availableNow: 'متاحة الآن',
    years: 'سنو��ت خبرة',
    perHour: 'جنيه/ساعة',
    reviews: 'تقييم',
    viewProfile: 'عرض الملف',
    noSitters: 'لا يوجد خالات متاحات حالياً',
    filterAvailable: 'متاحة فقط',
    allSitters: 'جميع الخالات',
    notifications: 'الإشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    noNotifications: 'لا توجد إشعارات',
  },
  en: {
    searchPlaceholder: 'Search for a sitter...',
    availableNow: 'Available Now',
    years: 'years experience',
    perHour: 'EGP/hour',
    reviews: 'reviews',
    viewProfile: 'View Profile',
    noSitters: 'No sitters available at the moment',
    filterAvailable: 'Available Only',
    allSitters: 'All Sitters',
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No notifications',
  }
};

export default function ClientHome({ language }: ClientHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedSitter, setSelectedSitter] = useState<Sitter | null>(null);
  const t = translations[language];

  const mockNotifications: Notification[] = [
    {
      id: 1,
      type: 'booking',
      title: language === 'ar' ? 'تم تأكيد الحجز' : 'Booking Confirmed',
      message: language === 'ar' 
        ? 'تم تأكيد حجزك مع فاطمة أحمد ليوم 25 نوفمبر الساعة 10:00 صباحاً'
        : 'Your booking with Fatima Ahmed for November 25 at 10:00 AM has been confirmed',
      time: language === 'ar' ? '10 دقائق' : '10 mins',
      read: false,
      icon: Check
    },
    {
      id: 2,
      type: 'message',
      title: language === 'ar' ? 'رسالة جديدة' : 'New Message',
      message: language === 'ar'
        ? 'نورهان محمد أرسلت لك رسالة'
        : 'Nourhan Mohamed sent you a message',
      time: language === 'ar' ? '30 دقيقة' : '30 mins',
      read: false,
      icon: MessageCircle
    },
    {
      id: 3,
      type: 'reminder',
      title: language === 'ar' ? 'تذكير بالموعد' : 'Appointment Reminder',
      message: language === 'ar'
        ? 'لديك موعد غداً الساعة 2:00 مساءً مع نورهان محمد'
        : 'You have an appointment tomorrow at 2:00 PM with Nourhan Mohamed',
      time: language === 'ar' ? 'ساعة واحدة' : '1 hour',
      read: true,
      icon: Clock
    },
    {
      id: 4,
      type: 'offer',
      title: language === 'ar' ? 'عرض خاص' : 'Special Offer',
      message: language === 'ar'
        ? 'احصلي على خصم 20% على حجزك القادم!'
        : 'Get 20% off your next booking!',
      time: language === 'ar' ? '3 ساعات' : '3 hours',
      read: true,
      icon: Gift
    },
    {
      id: 5,
      type: 'rating',
      title: language === 'ar' ? 'تقييم الخدمة' : 'Rate Service',
      message: language === 'ar'
        ? 'كيف كانت تجربتك مع منى عبدالله؟'
        : 'How was your experience with Mona Abdullah?',
      time: language === 'ar' ? 'أمس' : 'yesterday',
      read: true,
      icon: Bell
    },
    {
      id: 6,
      type: 'booking',
      title: language === 'ar' ? 'طلب حجز جديد' : 'New Booking Request',
      message: language === 'ar'
        ? 'ياسمين علي قبلت طلب حجزك'
        : 'Yasmine Ali accepted your booking request',
      time: language === 'ar' ? 'منذ يومين' : '2 days ago',
      read: true,
      icon: Calendar
    }
  ];

  const mockSitters: Sitter[] = [
  {
    id: 1,
    name: language === 'ar' ? 'فاطمة أحمد' : 'Fatima Ahmed',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    rating: 4.8,
    reviews: 124,
    experience: 5,
    location: language === 'ar' ? 'المنيا الجديدة' : 'New Minya',
    available: true,
    availabilityType: 'both',
    languages: ['العربية', 'English'],
    specialties: [language === 'ar' ? 'رعاية أطفال' : 'Childcare', language === 'ar' ? 'تعليم' : 'Education'],
    services: [
      {
        id: '1-1',
        name: language === 'ar' ? 'مجالسة أطفال من 5-12 سنة' : 'Childcare Ages 5-12',
        description: language === 'ar' ? 'رعاية ومجالسة أطفال من سن 5 إلى 12 سنة مع أنشطة تعليمية وترفيهية' : 'Care and supervision for children aged 5-12 with educational and fun activities',
        pricePerHour: 50,
        minHours: 2
      },
      {
        id: '1-2',
        name: language === 'ar' ? 'مجالسة وتعليم (2-4 سنوات)' : 'Childcare & Education (Ages 2-4)',
        description: language === 'ar' ? 'رعاية وتعليم الأطفال من سن سنتين إلى 4 سنوات مع أنشطة تنمية المهارات' : 'Care and education for toddlers aged 2-4 with skill development activities',
        pricePerHour: 60,
        minHours: 3
      }
    ]
  },
  {
    id: 2,
    name: language === 'ar' ? 'نورهان محمد' : 'Nourhan Mohamed',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    rating: 4.9,
    reviews: 98,
    experience: 7,
    location: language === 'ar' ? 'المنيا' : 'Minya',
    available: true,
    availabilityType: 'outside',
    languages: ['العربية', 'English', 'Français'],
    specialties: [language === 'ar' ? 'رعاية رضع' : 'Infant Care', language === 'ar' ? 'طبخ' : 'Cooking'],
    services: [
      {
        id: '2-1',
        name: language === 'ar' ? 'رعاية رضع (0-2 سنة)' : 'Infant Care (0-2 years)',
        description: language === 'ar' ? 'رعاية متخصصة للرضع والأطفال حديثي الولادة مع خبرة في الرضاعة والنوم' : 'Specialized care for infants and newborns with expertise in feeding and sleep routines',
        pricePerHour: 70,
        minHours: 3
      },
      {
        id: '2-2',
        name: language === 'ar' ? 'رعاية رضع وإعداد طعام' : 'Infant Care with Meal Prep',
        description: language === 'ar' ? 'رعاية الرضع مع إعداد وجبات صحية للطفل' : 'Infant care with healthy meal preparation for the child',
        pricePerHour: 85,
        minHours: 4
      }
    ]
  },
  {
    id: 3,
    name: language === 'ar' ? 'سارة حسن' : 'Sara Hassan',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    rating: 4.7,
    reviews: 156,
    experience: 4,
    location: language === 'ar' ? 'المنيا الجديدة' : 'New Minya',
    available: false,
    availabilityType: 'home',
    languages: ['العربية'],
    specialties: [language === 'ar' ? 'ألعاب تعليمية' : 'Educational Games'],
    services: [
      {
        id: '3-1',
        name: language === 'ar' ? 'ألعاب تعليمية وتنمية مهارات' : 'Educational Games & Skills Development',
        description: language === 'ar' ? 'أنشطة وألعاب تعليمية لتنمية المهارات الذهنية والحركية للأطفال' : 'Educational activities and games for mental and physical skills development',
        pricePerHour: 45,
        minHours: 2
      },
      {
        id: '3-2',
        name: language === 'ar' ? 'مساعدة في الواجبات المدرسية' : 'Homework Help',
        description: language === 'ar' ? 'مساعدة الأطفال في الواجبات المدرسية والمذاكرة' : 'Help children with homework and studying',
        pricePerHour: 40,
        minHours: 2
      }
    ]
  },
  {
    id: 4,
    name: language === 'ar' ? 'منى عبدالله' : 'Mona Abdullah',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    rating: 5.0,
    reviews: 203,
    experience: 10,
    location: language === 'ar' ? 'المنيا' : 'Minya',
    available: true,
    availabilityType: 'both',
    languages: ['العربية', 'English'],
    specialties: [language === 'ar' ? 'رعاية خاصة' : 'Special Care', language === 'ar' ? 'إسعافات أولية' : 'First Aid'],
    services: [
      {
        id: '4-1',
        name: language === 'ar' ? 'رعاية ذوي الاحتياجات الخاصة' : 'Special Needs Care',
        description: language === 'ar' ? 'رعاية متخصصة للأطفال ذوي الاحتياجات الخاصة مع خبرة في التعامل معهم' : 'Specialized care for children with special needs with expertise in handling them',
        pricePerHour: 90,
        minHours: 3
      },
      {
        id: '4-2',
        name: language === 'ar' ? 'رعاية أطفال (جميع الأعمار)' : 'Childcare (All Ages)',
        description: language === 'ar' ? 'رعاية شاملة للأطفال من جميع الأعمار مع خبرة واسعة' : 'Comprehensive care for children of all ages with extensive experience',
        pricePerHour: 65,
        minHours: 2
      }
    ]
  },
  {
    id: 5,
    name: language === 'ar' ? 'ياسمين علي' : 'Yasmine Ali',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
    rating: 4.6,
    reviews: 87,
    experience: 3,
    location: language === 'ar' ? 'المنيا الجديدة' : 'New Minya',
    available: true,
    availabilityType: 'home',
    languages: ['العربية'],
    specialties: [language === 'ar' ? 'فنون وحرف' : 'Arts & Crafts'],
    services: [
      {
        id: '5-1',
        name: language === 'ar' ? 'فنون وأشغال يدوية' : 'Arts & Crafts',
        description: language === 'ar' ? 'أنشطة فنية وأشغال يدوية لتنمية الإبداع عند الأطفال' : 'Arts and crafts activities to develop creativity in children',
        pricePerHour: 55,
        minHours: 2
      },
      {
        id: '5-2',
        name: language === 'ar' ? 'مجالسة أطفال (3-8 سنوات)' : 'Childcare (Ages 3-8)',
        description: language === 'ar' ? 'رعاية ومجالسة أطفال من سن 3 إلى 8 سنوات' : 'Care and supervision for children aged 3-8',
        pricePerHour: 48,
        minHours: 2
      }
    ]
  }
];

  const filteredSitters = mockSitters.filter(sitter => {
    const matchesSearch = sitter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sitter.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailable = !showAvailableOnly || sitter.available;
    return matchesSearch && matchesAvailable;
  });

  if (selectedSitter) {
    return (
      <SitterProfile
        language={language}
        sitter={selectedSitter}
        onBack={() => setSelectedSitter(null)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[#FB5E7A] mb-2">
            {language === 'ar' ? 'مرحباً بك! 👋' : 'Welcome! 👋'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'ar' ? 'ابحثي عن خالة موثوقة لأطفالك' : 'Find a trusted sitter for your children'}
          </p>
        </div>

        {/* Notification Bell */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative w-12 h-12 rounded-full bg-[#FB5E7A]/10 flex items-center justify-center hover:bg-[#FB5E7A]/20 transition-colors">
              <Bell className="w-6 h-6 text-[#FB5E7A]" />
              {/* Notification Badge */}
              {mockNotifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {mockNotifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align={language === 'ar' ? 'start' : 'end'}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t.notifications}</h3>
                <Button variant="ghost" size="sm" className="text-xs">
                  {t.markAllRead}
                </Button>
              </div>
            </div>
            <ScrollArea className="h-96">
              {mockNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t.noNotifications}</p>
                </div>
              ) : (
                <div className="divide-y">
                  {mockNotifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <div 
                        key={notification.id} 
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-[#FB5E7A]/5' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm`}>
                            <IconComponent className="w-4 h-4 text-[#FB5E7A]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-medium truncate">{notification.title}</p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-[#FB5E7A] rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" style={{ left: language === 'ar' ? 'auto' : '12px', right: language === 'ar' ? '12px' : 'auto' }} />
        <Input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 border-[#FB5E7A]"
          style={{ paddingLeft: language === 'ar' ? '16px' : '40px', paddingRight: language === 'ar' ? '40px' : '16px' }}
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={!showAvailableOnly ? 'default' : 'outline'}
          onClick={() => setShowAvailableOnly(false)}
          className={!showAvailableOnly ? 'bg-[#FB5E7A] hover:bg-[#e5536e]' : ''}
        >
          {t.allSitters}
        </Button>
        <Button
          variant={showAvailableOnly ? 'default' : 'outline'}
          onClick={() => setShowAvailableOnly(true)}
          className={showAvailableOnly ? 'bg-[#FB5E7A] hover:bg-[#e5536e]' : ''}
        >
          {t.filterAvailable}
        </Button>
      </div>

      {/* Sitters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSitters.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            {t.noSitters}
          </div>
        ) : (
          filteredSitters.map((sitter) => (
            <Card key={sitter.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative">
                  <img
                    src={sitter.image}
                    alt={sitter.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  {sitter.available && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="mb-1">{language === 'ar' ? 'الخالة : ' : 'Khala : '}{sitter.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{sitter.location}</span>
                      </div>
                    </div>
                    {sitter.available && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        <Clock className="w-3 h-3 mr-1" />
                        {t.availableNow}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{sitter.rating}</span>
                    <span className="text-sm text-gray-500">({sitter.reviews} {t.reviews})</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {sitter.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-bold font-normal">
                      {sitter.experience} {t.years}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setSelectedSitter(sitter)}
                      className="bg-[#FB5E7A] hover:bg-[#e5536e]"
                    >
                      {t.viewProfile}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}