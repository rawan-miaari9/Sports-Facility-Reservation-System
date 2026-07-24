export interface User {
  id: string;               
  _id?: string;            
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  role: 'admin' | 'user';  
  createdAt?: string | Date;
}

export interface Facility {
  id: string;
  name: string;
  status: 'Available' | 'Maintenance';
  imageUrl?: string;
}

export interface Reservation {
  id: string;
  facilityName: string;
  userName: string;
  userEmail: string;
  date: string;
  timeSlot: string;
  price: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

export interface Stats {
  totalSystemBookings: number;
  activeFacilitiesCount: number;
  totalFacilitiesCount: number;
  totalSystemUsers: number;
  estimatedRevenue: number;
}

export interface AdminDashboardData {
  currentUser: User;
  stats: Stats;
  chartData: Array<{
    day: string;
    util: number;
    revenue: number;
  }>;
  recentReservations: Reservation[];
}

export type AppView =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'facilities'
  | 'reservations'
  | 'users'
  | 'settings'
  | 'manage-facility';