import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Baby, Dumbbell, ShoppingCart, ChevronRight, ChevronLeft } from 'lucide-react';
import AuthPage from './AuthPage';
import type { Language, UserType } from '../App';

interface OnboardingPageProps {
  language: Language;
  onUserTypeSelect: (type: UserType) => void;
  onAuthenticate: (authenticated: boolean) => void;
  userType: UserType;
}

const translations = {
  ar: {
    welcome: 'مرحباً بك في خالة العيال',
    slides: [
      {
        icon: Baby,
        title: 'رعاية طفلك أثناء العمل',
        description: 'عندك طفل ومش عارفة تقدميله الرعاية بسبب شغلك؟ احنا هنا عشانك'
      },
      {
        icon: Dumbbell,
        title: 'استمتعي بوقتك',
        description: 'بتروحي الجيم وعايزة حد ياخد باله من طفلك وانتي بتتمرني؟ خليكي مطمنة'
      },
      {
        icon: ShoppingCart,
        title: 'اخرجي براحة بالك',
        description: 'نازلة السوق وما ينفعش تسيبي طفلك في البيت لوحده؟ احنا معاكي'
      }
    ],
    getStarted: 'ابدأي الآن',
    skip: 'ت��طي',
    selectAccount: 'اختاري نوع الحساب',
    superKhala: 'سوبر خالة',
    superKhalaDesc: 'أم تبحث عن خالة',
    becomeSitter: 'كوني واحدة من السوبر خالات',
    becomeSitterDesc: 'خالة ترغب بالعمل',
    next: 'التالي',
    previous: 'السابق'
  },
  en: {
    welcome: 'Welcome to Khalet El Eyal',
    slides: [
      {
        icon: Baby,
        title: 'Care for Your Child While Working',
        description: 'Have a child and can\'t provide care due to work? We\'re here for you'
      },
      {
        icon: Dumbbell,
        title: 'Enjoy Your Time',
        description: 'Going to the gym and need someone to watch your child? Rest assured'
      },
      {
        icon: ShoppingCart,
        title: 'Go Out with Peace of Mind',
        description: 'Going shopping and can\'t leave your child alone at home? We\'ve got you'
      }
    ],
    getStarted: 'Get Started',
    skip: 'Skip',
    selectAccount: 'Select Account Type',
    superKhala: 'Super Khala',
    superKhalaDesc: 'A mother looking for a sitter',
    becomeSitter: 'Become a Super Khala',
    becomeSitterDesc: 'A sitter looking for work',
    next: 'Next',
    previous: 'Previous'
  }
};

export default function OnboardingPage({ language, onUserTypeSelect, onAuthenticate, userType }: OnboardingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [showAccountSelection, setShowAccountSelection] = useState(false);
  const t = translations[language];

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

  if (showAccountSelection || userType) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFD1DA] to-[#FB5E7A]">
        <Card className="max-w-md w-full p-8 space-y-6">
          <h2 className="text-center">{t.selectAccount}</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                onUserTypeSelect('client');
                setShowAuth(true);
              }}
              className="w-full p-6 border-2 border-[#FB5E7A] rounded-lg hover:bg-[#FFD1DA]/30 transition-colors"
            >
              <h3 className="text-[#FB5E7A] mb-2">{language === 'ar' ? 'ابحث عن سوبر خالة' : 'Find a Super Khala'}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.superKhalaDesc}</p>
            </button>

            <button
              onClick={() => {
                onUserTypeSelect('sitter');
                setShowAuth(true);
              }}
              className="w-full p-6 border-2 border-[#FB5E7A] rounded-lg hover:bg-[#FFD1DA]/30 transition-colors"
            >
              <h3 className="text-[#FB5E7A] mb-2">{t.becomeSitter}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.becomeSitterDesc}</p>
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const slides = t.slides;
  const IconComponent = slides[currentSlide].icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFD1DA] to-[#FB5E7A]">
      <Card className="max-w-md w-full p-8 space-y-6">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-[#FB5E7A]' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="text-center space-y-6 py-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-[#FFD1DA] flex items-center justify-center">
              <IconComponent className="w-12 h-12 text-[#FB5E7A]" />
            </div>
          </div>
          
          <h2 className="text-[#FB5E7A]">{slides[currentSlide].title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{slides[currentSlide].description}</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {currentSlide > 0 ? (
            <Button
              variant="ghost"
              onClick={() => setCurrentSlide(prev => prev - 1)}
              className="text-[#FB5E7A]"
            >
              {language === 'ar' ? <ChevronRight className="w-4 h-4 ml-2" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
              {t.previous}
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => onUserTypeSelect(null)}
              className="text-gray-500"
            >
              {t.skip}
            </Button>
          )}

          {currentSlide < slides.length - 1 ? (
            <Button
              onClick={() => setCurrentSlide(prev => prev + 1)}
              className="bg-[#FB5E7A] hover:bg-[#e5536e]"
            >
              {t.next}
              {language === 'ar' ? <ChevronLeft className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          ) : (
            <Button
              onClick={() => setShowAccountSelection(true)}
              className="bg-[#FB5E7A] hover:bg-[#e5536e]"
            >
              {t.getStarted}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}