import { useState } from 'react';
import { Home, Calendar, DollarSign, User, CalendarClock } from 'lucide-react';
import SitterHome from './sitter/SitterHome';
import SitterBookings from './sitter/SitterBookings';
import SitterEarnings from './sitter/SitterEarnings';
import SitterNotifications from './sitter/SitterNotifications';
import SitterProfile from './sitter/SitterProfile';
import AvailabilityManagement from './sitter/AvailabilityManagement';
import type { Language } from '../App';

interface SitterAppProps {
  language: Language;
  onLogout: () => void;
  onLanguageChange: () => void;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
}

type SitterTab = 'home' | 'bookings' | 'earnings' | 'schedule' | 'profile';

const translations = {
  ar: {
    home: 'الرئيسية',
    bookings: 'الحجوزات',
    earnings: 'الأرباح',
    schedule: 'المواعيد',
    profile: 'الملف الشخصي'
  },
  en: {
    home: 'Home',
    bookings: 'Bookings',
    earnings: 'Earnings',
    schedule: 'Schedule',
    profile: 'Profile'
  }
};

export default function SitterApp({ language, onLogout, onLanguageChange, theme, onThemeChange }: SitterAppProps) {
  const [activeTab, setActiveTab] = useState<SitterTab>('home');
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Main Content */}
      <div className="pt-4">
        {activeTab === 'home' && <SitterHome language={language} />}
        {activeTab === 'bookings' && <SitterBookings language={language} />}
        {activeTab === 'earnings' && <SitterEarnings language={language} />}
        {activeTab === 'schedule' && <AvailabilityManagement language={language} />}
        {activeTab === 'profile' && <SitterProfile language={language} onLogout={onLogout} onLanguageChange={onLanguageChange} theme={theme} onThemeChange={onThemeChange} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-lg mx-auto flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'home' ? 'text-[#FB5E7A]' : 'text-gray-500'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">{t.home}</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'bookings' ? 'text-[#FB5E7A]' : 'text-gray-500'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs">{t.bookings}</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'schedule' ? 'text-[#FB5E7A]' : 'text-gray-500'
            }`}
          >
            <CalendarClock className="w-6 h-6" />
            <span className="text-xs">{t.schedule}</span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'earnings' ? 'text-[#FB5E7A]' : 'text-gray-500'
            }`}
          >
            <DollarSign className="w-6 h-6" />
            <span className="text-xs">{t.earnings}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'profile' ? 'text-[#FB5E7A]' : 'text-gray-500'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">{t.profile}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}