import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './components/ui/button';
import OnboardingPage from './components/OnboardingPage';
import ClientApp from './components/ClientApp';
import SitterApp from './components/SitterApp';

export type UserType = 'client' | 'sitter' | null;
export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check localStorage for saved preferences
    const savedUserType = localStorage.getItem('userType') as UserType;
    const savedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const savedLanguage = localStorage.getItem('language') as Language || 'ar';
    const savedTheme = localStorage.getItem('theme') as Theme || 'light';

    if (savedUserType) setUserType(savedUserType);
    if (savedAuth) setIsAuthenticated(savedAuth);
    setLanguage(savedLanguage);
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    localStorage.setItem('userType', type || '');
  };

  const handleAuthentication = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
    localStorage.setItem('isAuthenticated', authenticated.toString());
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
  };

  return (
    <div className={`min-h-screen ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Main Content */}
      {!userType || !isAuthenticated ? (
        <OnboardingPage
          language={language}
          onUserTypeSelect={handleUserTypeSelect}
          onAuthenticate={handleAuthentication}
          userType={userType}
        />
      ) : userType === 'client' ? (
        <ClientApp language={language} onLogout={handleLogout} onLanguageChange={toggleLanguage} theme={theme} onThemeChange={toggleTheme} />
      ) : (
        <SitterApp language={language} onLogout={handleLogout} onLanguageChange={toggleLanguage} theme={theme} onThemeChange={toggleTheme} />
      )}
    </div>
  );
}

export default App;