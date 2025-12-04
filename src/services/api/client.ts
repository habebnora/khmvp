// API Client Configuration
// Axios instance with interceptors for authentication and error handling

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { showError } from '@/utils/toast';

// API Base URL - should come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for CSRF protection
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from sessionStorage or memory
        const token = sessionStorage.getItem('authToken');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token if available
        const csrfToken = sessionStorage.getItem('csrfToken');
        if (csrfToken && config.headers) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle different error status codes
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    // Unauthorized - redirect to login
                    showError('يجب تسجيل الدخول أولاً');
                    // Clear auth data
                    sessionStorage.removeItem('authToken');
                    sessionStorage.removeItem('isAuth');
                    // Redirect to login
                    window.location.href = '/';
                    break;

                case 403:
                    // Forbidden
                    showError('ليس لديك صلاحية للقيام بهذا الإجراء');
                    break;

                case 404:
                    // Not found
                    showError('البيانات المطلوبة غير موجودة');
                    break;

                case 422:
                    // Validation error
                    const message = error.response.data?.message || 'بيانات غير صحيحة';
                    showError(message);
                    break;

                case 500:
                    // Server error
                    showError('خطأ في الخادم، يرجى المحاولة لاحقاً');
                    break;

                default:
                    showError('حدث خطأ غير متوقع');
            }
        } else if (error.request) {
            // Network error
            showError('خطأ في الاتصال بالإنترنت');
        } else {
            // Other errors
            showError('حدث خطأ غير متوقع');
        }

        return Promise.reject(error);
    }
);

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
    sessionStorage.setItem('authToken', token);
};

// Helper function to clear auth token
export const clearAuthToken = (): void => {
    sessionStorage.removeItem('authToken');
};

// Helper function to set CSRF token
export const setCsrfToken = (token: string): void => {
    sessionStorage.setItem('csrfToken', token);
};

export default apiClient;
