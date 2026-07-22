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
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  memberSince: string;
  bookingsCount: number;
  status: 'Available' | 'Booked' | 'Suspended';
  role: 'Admin' | 'Athlete';
}

export interface Facility {
  id: string;
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
  facilityId: string;
  facilityName: string;
  facilityImage: string;
  sport: string;
  userName: string;
  userEmail: string;
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
