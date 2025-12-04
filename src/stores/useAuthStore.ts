// Authentication Store
// Manages user authentication state, language, and theme

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { secureStorage, preferencesStorage } from '@/utils/secureStorage';

export type UserType = 'client' | 'sitter' | null;
export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    userType: 'client' | 'sitter';
}

interface AuthState {
    // State
    user: User | null;
    userType: UserType;
    isAuthenticated: boolean;
    language: Language;
    theme: Theme;

    // Actions
    setUser: (user: User | null) => void;
    setUserType: (type: UserType) => void;
    setAuthenticated: (isAuth: boolean) => void;
    setLanguage: (lang: Language) => void;
    setTheme: (theme: Theme) => void;
    toggleLanguage: () => void;
    toggleTheme: () => void;
    logout: () => void;

    // Initialize from storage
    initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            userType: null,
            isAuthenticated: false,
            language: 'ar',
            theme: 'light',

            // Set user
            setUser: (user) => set({ user }),

            // Set user type
            setUserType: (type) => {
                set({ userType: type });
                secureStorage.setUserType(type);
            },

            // Set authenticated
            setAuthenticated: (isAuth) => {
                set({ isAuthenticated: isAuth });
                secureStorage.setAuth(isAuth);
            },

            // Set language
            setLanguage: (lang) => {
                set({ language: lang });
                preferencesStorage.setLanguage(lang);
            },

            // Set theme
            setTheme: (theme) => {
                set({ theme });
                preferencesStorage.setTheme(theme);
                // Apply theme to document
                document.documentElement.classList.toggle('dark', theme === 'dark');
            },

            // Toggle language
            toggleLanguage: () => {
                const newLang = get().language === 'ar' ? 'en' : 'ar';
                get().setLanguage(newLang);
            },

            // Toggle theme
            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                get().setTheme(newTheme);
            },

            // Logout
            logout: () => {
                set({
                    user: null,
                    userType: null,
                    isAuthenticated: false,
                });
                secureStorage.clearAll();
            },

            // Initialize from storage
            initialize: () => {
                const savedUserType = secureStorage.getUserType();
                const savedAuth = secureStorage.getAuth();
                const savedLanguage = preferencesStorage.getLanguage();
                const savedTheme = preferencesStorage.getTheme();

                set({
                    userType: savedUserType,
                    isAuthenticated: savedAuth,
                    language: savedLanguage,
                    theme: savedTheme,
                });

                // Apply theme
                document.documentElement.classList.toggle('dark', savedTheme === 'dark');
            },
        }),
        {
            name: 'auth-storage',
            // Only persist non-sensitive data
            partialize: (state) => ({
                language: state.language,
                theme: state.theme,
            }),
        }
    )
);
