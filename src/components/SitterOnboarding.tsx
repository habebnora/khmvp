import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { DollarSign, Banknote, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

export type Language = 'ar' | 'en';

interface SitterOnboardingProps {
    language: Language;
    onComplete: () => void;
    onBack: () => void;
}

const translations = {
    ar: {
        slides: [
            {
                icon: DollarSign,
                title: 'اكسبي دخل إضافي من المنزل',
                description: 'عندك وقت فاضي وعايزة تكسبي فلوس؟ اشتغلي خالة وانتي في بيتك'
            },
            {
                icon: Banknote,
                title: 'حددي الأجر المناسب ليكي',
                description: 'انتي اللي تحددي أسعارك وتختاري العملاء المناسبين ليكي'
            },
            {
                icon: Clock,
                title: 'حددي أوقاتك بنفسك',
                description: 'انتي اللي تحددي مواعيد شغلك، مرونة كاملة تناسب ظروفك'
            }
        ],
        getStarted: 'ابدأي الآن',
        skip: 'تخطي',
        next: 'التالي',
        previous: 'السابق'
    },
    en: {
        slides: [
            {
                icon: DollarSign,
                title: 'Earn Extra Income from Home',
                description: 'Have free time and want to earn money? Work as a sitter from home'
            },
            {
                icon: Banknote,
                title: 'Set Your Own Rates',
                description: 'You set your prices and choose the clients that suit you'
            },
            {
                icon: Clock,
                title: 'Set Your Own Schedule',
                description: 'You decide your working hours, complete flexibility to suit your circumstances'
            }
        ],
        getStarted: 'Get Started',
        skip: 'Skip',
        next: 'Next',
        previous: 'Previous'
    }
};

export default function SitterOnboarding({ language, onComplete, onBack }: SitterOnboardingProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const t = translations[language];
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
                            className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-[#FB5E7A]' : 'w-2 bg-gray-300'
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
                            onClick={onBack}
                            className="text-gray-500"
                        >
                            {language === 'ar' ? <ChevronRight className="w-4 h-4 ml-2" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
                            رجوع
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
                            onClick={onComplete}
                            className="bg-[#FB5E7A] hover:bg-[#e5536e]"
                        >
                            {t.getStarted}
                        </Button>
                    )}
                </div>

                {/* Skip Button */}
                <div className="text-center">
                    <Button
                        variant="link"
                        onClick={onComplete}
                        className="text-gray-500"
                    >
                        {t.skip}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
