export interface Service {
    id: string;
    name: string;
    description: string;
    pricePerHour: number; // This maps to 'price' in DB for simplicity in UI
    price?: number; // Fallback
    minHours?: number;
    features?: string[];
    is_active?: boolean;
    service_type?: string; // For raw DB mapping compatibility
    minimum_hours?: number; // DB field
}

export interface Sitter {
    id: string;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    experience: number;
    location: string;
    available: boolean;
    availabilityType: 'home' | 'outside' | 'both';
    languages: string[];
    specialties: string[];
    services: Service[];
    bio?: string;
    raw?: any; // Temporary: holds the full DB profile object if needed
}

export type SitterProfile = SitterDBProfile;

export interface SitterServiceDB {
    id: string;
    sitter_id: string;
    service_type: string;
    price: number;
    description: string | null;
    minimum_hours: number;
    features: any; // JSONb
    is_active: boolean;
}

export interface SitterSkillDB {
    id: string;
    sitter_id: string;
    skill: string;
}

export interface SitterLanguageDB {
    id: string;
    sitter_id: string;
    language: string;
}

export interface SitterDBProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    experience_years: number;
    average_rating: number;
    review_count: number;
    availability_type: 'home' | 'outside' | 'both' | null;
    is_verified: boolean;
    is_active: boolean;
    sitter_services?: SitterServiceDB[];
    sitter_skills?: SitterSkillDB[];
    sitter_languages?: SitterLanguageDB[];
}

export interface SitterAvailability {
    id: string;
    sitter_id: string;
    date: string | null;
    day_of_week: number | null;
    start_time: string;
    end_time: string;
    is_recurring: boolean;
    created_at?: string;
}

export interface Booking {
    id: string;
    client_id: string;
    sitter_id: string;
    date: string;
    start_time: string;
    duration_hours: number;
    location: string;
    booking_type: 'home' | 'outside';
    status: 'pending' | 'waiting_payment' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    total_price: number;
    children_count?: number;
    notes?: string;
    created_at: string;
    // Joins
    client?: { full_name: string; avatar_url: string };
    sitter?: { full_name: string; avatar_url: string };
}

export interface Child {
    id: string;
    client_id: string;
    name: string;
    age: number;
    gender: 'male' | 'female';
    notes?: string;
    medical_conditions?: string;
    allergies?: string;
    special_needs?: string;
    created_at: string;
}
