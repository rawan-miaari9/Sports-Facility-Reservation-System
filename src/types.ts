export type AppView =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'facilities'
  | 'reservations'
  | 'users'
  | 'settings'
  | 'manage-facility';

export interface User {
  id: string;
  _id?: string; // Support for MongoDB backend IDs
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  memberSince?: string;
  bookingsCount?: number;
  status?: 'Available' | 'Booked' | 'Suspended';
  role: 'admin' | 'user' ; // Flexible case matching for role checks
}

export interface Facility {
  id: string;
  _id?: string;
  name: string;
  type: string;
  location: string;
  status: 'Available' | 'Booked' | 'Maintenance';
  capacity: string;
  pricePerHour: number;
  surface: string;
  image: string;
  isIndoor: boolean;
  description: string;
  features: string[];
}

export interface Reservation {
  id: string;
  _id?: string;
  facilityId: string;
  facilityName: string;
  facilityImage: string;
  sport: string;
  userName: string;
  userEmail: string;
  userId?: string; // Needed for user-specific filtering
  date: string;
  timeSlot: string;
  price: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
  equipment: string[];
}

export interface SystemStats {
  totalBookings: number;
  activeFacilities: number;
  newUsers: number;
  totalCustomers: number;
  membershipGrowth: string;
  churnRate: string;
  totalSpend: number;
  hoursThisMonth: number;
}