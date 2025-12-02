import { useState } from 'react';
import { Home, Calendar, User, Clock, FileText } from 'lucide-react';
import ClientHome from './client/ClientHome';
import ClientBookings from './client/ClientBookings';
import ClientActiveBookings from './client/ClientActiveBookings';
import ClientProfile from './client/ClientProfile';
import type { Language } from '../App';

interface ClientAppProps {
  language: Language;
  onLogout: () => void;
  onLanguageChange: () => void;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
}

type ClientTab = 'home' | 'requests' | 'schedule' | 'profile';

const translations = {
  ar: {
    home: 'الرئيسية',
    requests: 'الطلبات',
    schedule: 'مواعيدي',
    profile: 'الملف الشخصي',
    logout: 'تسجيل خروج'
  },
  en: {
    home: 'Home',
    requests: 'Requests',
    schedule: 'My Schedule',
    profile: 'Profile',
    logout: 'Logout'
  }
};

export default function ClientApp({ language, onLogout, onLanguageChange, theme, onThemeChange }: ClientAppProps) {
  const [activeTab, setActiveTab] = useState<ClientTab>('home');
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Main Content */}
      <div className="pt-4">
        {activeTab === 'home' && <ClientHome language={language} />}
        {activeTab === 'requests' && <ClientBookings language={language} />}
        {activeTab === 'schedule' && <ClientActiveBookings language={language} />}
        {activeTab === 'profile' && <ClientProfile language={language} onLogout={onLogout} onLanguageChange={onLanguageChange} theme={theme} onThemeChange={onThemeChange} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 z-50">
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
            onClick={() => setActiveTab('requests')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'requests' ? 'text-[#FB5E7A]' : 'text-gray-500'
            }`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-xs">{t.requests}</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'schedule' ? 'text-[#FB5E7A]' : 'text-gray-500'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs">{t.schedule}</span>
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