export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  scheduled_at: string;
  service_address: string;
  notes: string | null;
  status: BookingStatus;
  price_snapshot: number;
  created_at: string;
  updated_at: string;
  service?: Service;
}

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  availableServices: number;
}
