import { useAuthStore } from '../stores/useAuthStore';
import { translations, type Translations } from '../locales';

export function useTranslation() {
    const { language } = useAuthStore();

    const t = translations[language] as Translations;

    return { t, language };
}
