import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Search, Star, MapPin, Clock, Bell } from 'lucide-react';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import SitterProfile from './SitterProfile';
import { sitterService } from '../../services/sitter';
import { notificationService, type Notification } from '../../services/notification';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useTranslation } from '../../hooks/useTranslation';
import { ErrorBoundary } from '../ui/ErrorBoundary';

import { Sitter, SitterDBProfile } from '../../types/core';

interface ClientHomeProps {
  onNavigate?: (tab: 'home' | 'requests' | 'schedule' | 'profile') => void;
}


export default function ClientHome({ onNavigate }: ClientHomeProps) {
  const { user } = useAuthStore();
  const { t, language } = useTranslation();
  const homeT = t.client.homePage;
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || homeT.guest;

  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedSitter, setSelectedSitter] = useState<Sitter | null>(null);
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadSitters();
    if (user?.id) {
      loadNotifications();

      const channel = supabase
        .channel('client-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            toast.info(newNotification.title);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  const loadNotifications = async () => {
    try {
      if (!user?.id) return;
      const data = await notificationService.getRecentNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadSitters = async () => {
    try {
      setLoading(true);
      setHasError(false);

      const fetchPromise = sitterService.getAllSitters();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 8000)
      );

      const data = await Promise.race([fetchPromise, timeoutPromise]) as SitterDBProfile[];

      if (data) {
        const formattedSitters: Sitter[] = data.map((profile: SitterDBProfile) => {
          const activeServices = profile.sitter_services
            ?.filter((s) => s.is_active !== false)
            .map((s) => ({
              id: s.id,
              name: s.service_type,
              description: s.description || '',
              pricePerHour: s.price,
              minHours: s.minimum_hours || 1,
              features: typeof s.features === 'string' ? JSON.parse(s.features) : (s.features || [])
            })) || [];

          return {
            id: profile.id,
            name: profile.full_name || 'Khala',
            image: profile.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            rating: profile.average_rating ? Number(profile.average_rating) : 5.0,
            reviews: profile.review_count ? Number(profile.review_count) : 0,
            experience: profile.experience_years || 0,
            location: profile.location || homeT.notSpecified,
            available: activeServices.length > 0,
            availabilityType: profile.availability_type || 'both',
            languages: profile.sitter_languages?.map((l) => l.language) || [],
            specialties: profile.sitter_skills?.map((s) => s.skill) || [],
            services: activeServices,
            raw: profile
          };
        });
        setSitters(formattedSitters);
      }
    } catch (error) {
      console.error("Failed to load sitters", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredSitters = sitters.filter(sitter => {
    const matchesSearch = sitter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sitter.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailable = !showAvailableOnly || sitter.available;
    return matchesSearch && matchesAvailable;
  });

  if (selectedSitter) {
    return (
      <SitterProfile
        sitter={selectedSitter}
        onBack={() => setSelectedSitter(null)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-50 bg-gray-50 dark:bg-gray-900 pt-4 pb-2 -mx-4 px-4 mb-4 border-b border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[#FB5E7A] mb-2 font-bold text-xl">
              {homeT.welcome.replace('{name}', userName)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {homeT.description}
            </p>
          </div>

          {/* Notification Bell */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative w-10 h-10 rounded-full bg-[#FB5E7A]/10 flex items-center justify-center hover:bg-[#FB5E7A]/20 transition-colors">
                <Bell className="w-5 h-5 text-[#FB5E7A]" />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align={language === 'ar' ? 'start' : 'end'}>
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-[#FB5E7A]">{homeT.notifications}</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={async () => {
                      if (user?.id) {
                        await notificationService.markAllAsRead(user.id);
                        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                      }
                    }}
                    className="text-xs text-gray-500 hover:text-[#FB5E7A]"
                  >
                    {homeT.markAllRead}
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">{homeT.noNotifications}</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!notification.is_read ? 'bg-[#FFD1DA]/5' : ''}`}
                      onClick={async () => {
                        if (!notification.is_read) {
                          await notificationService.markAsRead(notification.id);
                          setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
                        }

                        if (notification.type.startsWith('booking_') && onNavigate) {
                          onNavigate('requests');
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.is_read ? 'bg-[#FB5E7A]' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(notification.created_at).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" style={{ left: language === 'ar' ? 'auto' : '12px', right: language === 'ar' ? '12px' : 'auto' }} />
          <Input
            type="text"
            placeholder={homeT.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 border-[#FB5E7A] h-10 text-sm"
            style={{ paddingLeft: language === 'ar' ? '16px' : '36px', paddingRight: language === 'ar' ? '36px' : '16px' }}
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Button
            variant={!showAvailableOnly ? 'default' : 'outline'}
            onClick={() => setShowAvailableOnly(false)}
            size="sm"
            className={!showAvailableOnly ? 'bg-[#FB5E7A] hover:bg-[#e5536e]' : ''}
          >
            {homeT.allSitters}
          </Button>
          <Button
            variant={showAvailableOnly ? 'default' : 'outline'}
            onClick={() => setShowAvailableOnly(true)}
            size="sm"
            className={showAvailableOnly ? 'bg-[#FB5E7A] hover:bg-[#e5536e]' : ''}
          >
            {homeT.filterAvailable}
          </Button>
        </div>
      </div>

      {/* Sitters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12">
            <div className="w-10 h-10 border-4 border-[#FB5E7A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">{homeT.findingSitters}</p>
          </div>
        ) : hasError ? (
          <div className="col-span-2 text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
            <p className="text-red-500 mb-4 font-medium">
              {homeT.errorLoading}
            </p>
            <Button
              onClick={loadSitters}
              className="bg-[#FB5E7A] hover:bg-[#e5536e]"
            >
              {homeT.retry}
            </Button>
          </div>
        ) : filteredSitters.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            {homeT.noSitters}
          </div>
        ) : (
          filteredSitters.map((sitter) => (
            <ErrorBoundary key={sitter.id} fallback={
              <Card className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                <p className="text-red-500 text-sm text-center">Unable to load this profile</p>
              </Card>
            }>
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={sitter.image}
                      alt={sitter.name}
                      loading="lazy"
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md relative z-10"
                    />
                    <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white z-20 ${sitter.availabilityType === 'home' || sitter.availabilityType === 'both' ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                  </div>
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="mb-1">{t.client.homePage.khala}{sitter.name}</h3>
                        {!sitter.available && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-500 mb-2">
                            {homeT.currentlyUnavailable}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <MapPin className="w-3 h-3" />
                          <span>{sitter.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-gray-900 dark:text-gray-100">{sitter.rating}</span>
                          <span>({sitter.reviews})</span>
                        </div>
                      </div>
                      {sitter.available ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          <Clock className="w-3 h-3 mr-1" />
                          {homeT.availableNow}
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                          <Clock className="w-3 h-3 mr-1" />
                          {homeT.busy}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {sitter.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {sitter.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{sitter.specialties.length - 3}</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-bold">
                        {sitter.experience} {homeT.years}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => setSelectedSitter(sitter)}
                        className="bg-[#FB5E7A] hover:bg-[#e5536e]"
                      >
                        {homeT.viewProfile}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </ErrorBoundary>
          ))
        )}
      </div>
    </div>
  );
}