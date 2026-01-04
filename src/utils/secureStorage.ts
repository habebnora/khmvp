// Secure Storage Utility
// Replaces localStorage with sessionStorage for sensitive data

/**
 * Secure storage for authentication data
 * Uses sessionStorage instead of localStorage for better security
 */
export const secureStorage = {
    // Authentication
    setAuth: (isAuthenticated: boolean): void => {
        sessionStorage.setItem('isAuth', isAuthenticated.toString());
    },

    getAuth: (): boolean => {
        return sessionStorage.getItem('isAuth') === 'true';
    },

    clearAuth: (): void => {
        sessionStorage.removeItem('isAuth');
    },

    // User Type
    setUserType: (userType: 'client' | 'sitter' | 'khala' | 'admin' | null): void => {
        if (userType) {
            sessionStorage.setItem('userType', userType);
        } else {
            sessionStorage.removeItem('userType');
        }
    },

    getUserType: (): 'client' | 'sitter' | 'khala' | 'admin' | null => {
        const type = sessionStorage.getItem('userType');
        return type as 'client' | 'sitter' | 'khala' | 'admin' | null;
    },

    clearUserType: (): void => {
        sessionStorage.removeItem('userType');
    },

    // Clear all auth data
    clearAll: (): void => {
        sessionStorage.removeItem('isAuth');
        sessionStorage.removeItem('userType');
    },
};

/**
 * Preferences storage (can use localStorage as it's not sensitive)
 * For language, theme, etc.
 */
export const preferencesStorage = {
    // Language
    setLanguage: (language: 'ar' | 'en'): void => {
        localStorage.setItem('language', language);
    },

    getLanguage: (): 'ar' | 'en' => {
        return (localStorage.getItem('language') as 'ar' | 'en') || 'ar';
    },

    // Theme
    setTheme: (theme: 'light' | 'dark'): void => {
        localStorage.setItem('theme', theme);
    },

    getTheme: (): 'light' | 'dark' => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    },

    // Clear all preferences
    clearAll: (): void => {
        localStorage.removeItem('language');
        localStorage.removeItem('theme');
    },
};
