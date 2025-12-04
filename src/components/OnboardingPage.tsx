import { useState } from 'react';
import { Card } from './ui/card';
import AuthPage from './AuthPage';
import ClientOnboarding from './ClientOnboarding';
import SitterOnboarding from './SitterOnboarding';
import type { Language, UserType } from '../App';

interface OnboardingPageProps {
  language: Language;
  onUserTypeSelect: (type: UserType) => void;
  onAuthenticate: (authenticated: boolean) => void;
  userType: UserType;
}

const translations = {
  ar: {
    selectAccount: 'اختاري نوع الحساب',
    findSitter: 'ابحث عن سوبر خالة',
    findSitterDesc: 'أم تبحث عن خالة',
    becomeSitter: 'كوني واحدة من السوبر خالات',
    becomeSitterDesc: 'خالة ترغب بالعمل',
  },
  en: {
    selectAccount: 'Select Account Type',
    findSitter: 'Find a Super Khala',
    findSitterDesc: 'A mother looking for a sitter',
    becomeSitter: 'Become a Super Khala',
    becomeSitterDesc: 'A sitter looking for work',
  }
};

export default function OnboardingPage({ language, onUserTypeSelect, onAuthenticate, userType }: OnboardingPageProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const t = translations[language];

  // If authenticated, show AuthPage
  if (showAuth && userType) {
    return (
      <AuthPage
        language={language}
        userType={userType}
        onAuthenticate={onAuthenticate}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  // If user type selected and onboarding not completed, show appropriate onboarding
  if (userType && !showOnboarding) {
    if (userType === 'client') {
      return (
        <ClientOnboarding
          language={language}
          onComplete={() => setShowAuth(true)}
          onBack={() => onUserTypeSelect(null)}
        />
      );
    } else {
      return (
        <SitterOnboarding
          language={language}
          onComplete={() => setShowAuth(true)}
          onBack={() => onUserTypeSelect(null)}
        />
      );
    }
  }

  // Default: Show account type selection
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFD1DA] to-[#FB5E7A]">
      <Card className="max-w-md w-full p-8 space-y-6">
        <h2 className="text-center text-2xl font-bold text-[#FB5E7A]">{t.selectAccount}</h2>

        <div className="space-y-4">
          <button
            onClick={() => onUserTypeSelect('client')}
            className="w-full p-6 border-2 border-[#FB5E7A] rounded-lg hover:bg-[#FFD1DA]/30 transition-colors"
          >
            <h3 className="text-[#FB5E7A] mb-2 text-lg font-semibold">{t.findSitter}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.findSitterDesc}</p>
          </button>

          <button
            onClick={() => onUserTypeSelect('sitter')}
            className="w-full p-6 border-2 border-[#FB5E7A] rounded-lg hover:bg-[#FFD1DA]/30 transition-colors"
          >
            <h3 className="text-[#FB5E7A] mb-2 text-lg font-semibold">{t.becomeSitter}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.becomeSitterDesc}</p>
          </button>
        </div>
      </Card>
    </div>
  );
}