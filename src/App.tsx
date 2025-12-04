import { useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuthStore } from './stores/useAuthStore';

// Lazy load main components for better performance
const OnboardingPage = lazy(() => import('./components/OnboardingPage'));
const ClientApp = lazy(() => import('./components/ClientApp'));
const SitterApp = lazy(() => import('./components/SitterApp'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FB5E7A]"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
        جاري التحميل...
      </p>
    </div>
  </div>
);

function App() {
  // Use Zustand store instead of local state
  const {
    userType,
    isAuthenticated,
    language,
    theme,
    setUserType,
    setAuthenticated,
    toggleLanguage,
    toggleTheme,
    logout,
    initialize,
  } = useAuthStore();

  // Initialize store from storage on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Toast Notifications */}
        <Toaster
          position={language === 'ar' ? 'top-left' : 'top-right'}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          richColors
          closeButton
        />

        {/* Main Content */}
        <Suspense fallback={<PageLoader />}>
          {!userType || !isAuthenticated ? (
            <OnboardingPage
              language={language}
              onUserTypeSelect={setUserType}
              onAuthenticate={setAuthenticated}
              userType={userType}
            />
          ) : userType === 'client' ? (
            <ClientApp
              language={language}
              onLogout={logout}
              onLanguageChange={toggleLanguage}
              theme={theme}
              onThemeChange={toggleTheme}
            />
          ) : (
            <SitterApp
              language={language}
              onLogout={logout}
              onLanguageChange={toggleLanguage}
              theme={theme}
              onThemeChange={toggleTheme}
            />
          )}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;