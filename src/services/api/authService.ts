// Authentication API Service
// Handles login, signup, OTP verification, and logout

import apiClient, { setAuthToken, clearAuthToken } from './client';

export interface LoginCredentials {
    emailOrPhone: string;
    password: string;
}

export interface SignupData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    userType: 'client' | 'sitter';
}

export interface OTPVerification {
    phone: string;
    code: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        userType: 'client' | 'sitter';
    };
}

export const authService = {
    /**
     * Login user
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

        // Store token
        if (response.data.token) {
            setAuthToken(response.data.token);
        }

        return response.data;
    },

    /**
     * Signup new user
     */
    signup: async (data: SignupData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/signup', data);

        // Store token
        if (response.data.token) {
            setAuthToken(response.data.token);
        }

        return response.data;
    },

    /**
     * Verify OTP code
     */
    verifyOTP: async (data: OTPVerification): Promise<{ success: boolean }> => {
        const response = await apiClient.post('/auth/verify-otp', data);
        return response.data;
    },

    /**
     * Resend OTP code
     */
    resendOTP: async (phone: string): Promise<{ success: boolean }> => {
        const response = await apiClient.post('/auth/resend-otp', { phone });
        return response.data;
    },

    /**
     * Forgot password
     */
    forgotPassword: async (email: string): Promise<{ success: boolean }> => {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    /**
     * Reset password
     */
    resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean }> => {
        const response = await apiClient.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            // Clear token even if request fails
            clearAuthToken();
        }
    },

    /**
     * Get current user
     */
    getCurrentUser: async (): Promise<AuthResponse['user']> => {
        const response = await apiClient.get<{ user: AuthResponse['user'] }>('/auth/me');
        return response.data.user;
    },

    /**
     * Refresh token
     */
    refreshToken: async (): Promise<{ token: string }> => {
        const response = await apiClient.post<{ token: string }>('/auth/refresh');

        if (response.data.token) {
            setAuthToken(response.data.token);
        }

        return response.data;
    },
};
