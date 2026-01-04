// Authentication Store
// Manages user authentication state, language, and theme

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { preferencesStorage, secureStorage } from '@/utils/secureStorage';
import { monitoring } from '@/lib/monitoring';

export type UserType = 'client' | 'sitter' | 'khala' | 'admin' | null;
export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

interface User {
    id: string;
    email?: string;
    user_metadata: {
        full_name?: string;
        phone?: string;
        role?: UserType;
        [key: string]: any;
    };
}

interface AuthState {
    // State
    user: User | null;
    userType: UserType;
    isAuthenticated: boolean;
    language: Language;
    theme: Theme;
    isLoading: boolean;

    // Actions
    setUserType: (type: UserType) => void;
    setLanguage: (lang: Language) => void;
    setTheme: (theme: Theme) => void;
    toggleLanguage: () => void;
    toggleTheme: () => void;

    // Auth Actions
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string, data: {
        full_name: string;
        phone: string;
        mother_job?: string;
        father_job?: string;
        default_address?: string;
    }) => Promise<{ error: any }>;
    verifyOTP: (email: string, token: string, type: 'signup' | 'recovery' | 'email_change') => Promise<{ error: any }>;
    resendOTP: (email: string, type: 'signup' | 'email_change') => Promise<{ error: any }>;
    logout: () => Promise<void>;

    // Initialize
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // Initial state
    user: null,
    userType: null,
    isAuthenticated: false,
    language: 'ar',
    theme: 'light',
    isLoading: true,

    // Set user type
    setUserType: (type) => {
        set({ userType: type });
        secureStorage.setUserType(type);
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

    // Sign In
    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return { error };

        if (data.user) {
            // Get profile to check role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            set({
                user: data.user,
                isAuthenticated: true,
                userType: profile?.role as UserType
            });
        }
        return { error: null };
    },

    // Sign Up
    signUp: async (email, password, { full_name, phone, mother_job, father_job, default_address }) => {
        const userType = get().userType;

        // 1. Sign up auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    phone,
                    role: userType
                }
            }
        });

        if (authError) return { error: authError };

        if (authData.user) {
            // Profile is created automatically via database trigger (handle_new_user)
            // Now update with additional fields for clients
            if (userType === 'client' && (mother_job || father_job || default_address)) {
                let retries = 3;
                while (retries > 0) {
                    const { data: updatedData, error: updateError } = await supabase
                        .from('profiles')
                        .update({
                            mother_job,
                            father_job,
                            default_address
                        })
                        .eq('id', authData.user.id)
                        .select();

                    if (updateError) {
                        monitoring.logError(updateError, { context: 'signUp_profile_update' });
                        break;
                    }

                    if (updatedData && updatedData.length > 0) {
                        break;
                    }

                    retries--;
                    if (retries > 0) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
        }
        return { error: null };
    },

    // Verify OTP
    verifyOTP: async (email, token, type) => {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type,
        });

        if (error) return { error };

        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            set({
                user: data.user,
                isAuthenticated: true,
                userType: profile?.role as UserType
            });
        }
        return { error: null };
    },

    // Resend OTP
    resendOTP: async (email, type) => {
        const { error } = await supabase.auth.resend({
            type,
            email,
        });
        return { error };
    },

    // Logout
    logout: async () => {
        await supabase.auth.signOut();
        secureStorage.clearAll();
        set({
            user: null,
            userType: null,
            isAuthenticated: false,
        });
    },

    // Initialize
    initialize: async () => {
        const savedLanguage = preferencesStorage.getLanguage();
        const savedTheme = preferencesStorage.getTheme();

        set({
            language: savedLanguage,
            theme: savedTheme,
        });

        document.documentElement.classList.toggle('dark', savedTheme === 'dark');

        const initPromise = (async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const savedUserType = secureStorage.getUserType();
                if (savedUserType && !session?.user) {
                    set({ userType: savedUserType });
                }

                if (session?.user) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    if (profile) {
                        set({
                            user: session.user as User,
                            isAuthenticated: true,
                            userType: (profile.role as UserType) || savedUserType,
                        });
                        if (profile.role) secureStorage.setUserType(profile.role as UserType);
                    } else if (!profileError) {
                        monitoring.logInfo('Profile not found during initialization, signing out...');
                        await supabase.auth.signOut();
                        secureStorage.clearAll();
                        set({ user: null, isAuthenticated: false, userType: null });
                    }
                }
            } catch (err) {
                monitoring.logError(err as Error, { context: 'auth_initialize' });
            }
        })();

        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000));
        await Promise.race([initPromise, timeoutPromise]);
        set({ isLoading: false });

        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                if (get().user?.id === session.user.id && get().isAuthenticated) return;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .maybeSingle();

                if (profile) {
                    set({
                        user: session.user as User,
                        isAuthenticated: true,
                        userType: profile.role as UserType
                    });
                }
            } else if (event === 'SIGNED_OUT') {
                set({
                    user: null,
                    isAuthenticated: false,
                    userType: null
                });
            }
        });
    },
}));
