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