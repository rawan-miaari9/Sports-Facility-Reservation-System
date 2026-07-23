import { Facility, User, Reservation } from './types';

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Championship Court',
    type: 'Basketball',
    location: 'Main Wing',
    status: 'Available',
    capacity: '12 Pax',
    pricePerHour: 50,
    surface: 'Pro-Hardwood Surface',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFPO0A4xcBC7FZ31yS_xtZ6OhkZ4RigUi1IPwrglKmKACde2amhmor-I3IKXubc98RqeY2El_N6TGs1dBXBoQlxWF13ONiTz7QYmJo9tjEEOqh1Acz1PfU-7G_6VCLG_D2e3vGfawKmVrsbr0VgouchsjFWW9006sX_9IIS319_jK7ce59-hlxheKFTFL1m8JBeV--wkjFfHEUgNqt9RI3wlZp_MEn_X1c0DMNBvdWbftDvnOeyCru7kaFrg43OkMxvyPryy5J0Pw',
    isIndoor: true,
    description: 'A premium air-conditioned hardwood arena, featuring professional grade cushions, FIBA-approved hoops, and full perimeter LED electronic scoreboard controls.',
    features: ['High-Lumen LED', 'Electronic Scoreboard', 'Sub-Floor Cushioning', 'Air Conditioned']
  },
  {
    id: 'fac-2',
    name: 'Court 3 - Clay Arena',
    type: 'Tennis',
    location: 'Outdoor North',
    status: 'Available',
    capacity: '4 Pax',
    pricePerHour: 35,
    surface: 'Premium Red Clay',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAujDlaKORQ3vfeSg1sm58FO2COMrnktnMa7OR3M2uLZ7BepfvubwrH9JFAJpGePw_ccYNV0rbVof2yIXf6pzF2IZJaEeJqZDIRiBHTDv0NoHEvnKqS5T94if1wBXPTcWRHFfqoiPziUN_jIYHK-tk7eNkWt5aP7lEhmuOYVffzGt6LLyOB90SHfGHUN31F0aw3O-aLxhYeEpYKQVj6aIsO7saZ04A0ZQ0QjdGweiPG6TvIwJD2nm2rzg0lC5TTsLF3eqh48tXXgew',
    isIndoor: false,
    description: 'Impeccable outdoor red clay court styled after Roland Garros, complete with professional windbreaks, top-tier court irrigation, and full lighting package for late play.',
    features: ['Windbreaks', 'Irrigation System', 'Night Lights', 'Changing Room']
  },
  {
    id: 'fac-3',
    name: 'Pitch A - Synthetic Field',
    type: 'Soccer',
    location: 'Outdoor North',
    status: 'Booked',
    capacity: '22 Pax',
    pricePerHour: 75,
    surface: 'Synthetic Turf',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGXyUhlyzlfUdX_4Q0W_8x3ad4BSds7AOxRDaVG_sGHTsOUntWRX-bex5-Vy_jJJ5Hy2HM1q_TfUZOkarh0kDJQ_RtaBUN8q8lw5OhInTfhDaQrkBoR6OeeBYmrtrdqqSodhEr9uICi3Vpd1NS-WwP4dKbStr1k9XJn9QVvP7Qh_LGQkfcdfRoH6IFiQtmEM9zccJIZ4X8Lyc0QqKEGaVK5Apzu4M5x4IbV8SKrMs-WbloFfDLe6PcxQX5n3_pjiOIGmkyQ3fRAE4',
    isIndoor: false,
    description: 'Pro-grade artificial turf designed for 11-a-side match play, featuring professional high-tensile mesh goal nets and a sideline team technical zone.',
    features: ['Professional Goals', 'Team Bench', 'Warmup Area', 'Night Lights']
  },
  {
    id: 'fac-4',
    name: 'Glass Padel Arena',
    type: 'Padel',
    location: 'South Wing',
    status: 'Available',
    capacity: '4 Pax',
    pricePerHour: 45,
    surface: 'Super-Cushioned Blue Turf',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNdhoHwC_Jabx1hqo4V_LSEMkTYfwlYdpW9GI7hgfmCHp3qvjhvENGlePLnycHUQr-QLBMGwoAJZj8xIfc-VGIkUFl6QaDFyBVKAhFZfN1xWPTsSglKG585-vCOXluqEpvYCE-yCDHW2qsMgSY5ceE2KeUoElggqnfGvg_84eps30m7MgjoEDW7hNXwTLhw8Cl_eSWUr2G9pzAXW6WYhE9fskljGZxy3lb_5OSRyQcD6OG5gchTQtWwg28UlBrLTFwt_j0hXpDfpA',
    isIndoor: true,
    description: 'Fully enclosed indoor Padel court featuring panoramic 12mm structural tempered glass panels and custom dense texturized turf to guarantee high bouncing.',
    features: ['Panoramic Glass', 'Indoor AC', 'Pro Lighting', 'Racquet Hire']
  },
  {
    id: 'fac-5',
    name: 'Olympic Lane 4',
    type: 'Aquatics',
    location: 'Pool Deck',
    status: 'Maintenance',
    capacity: '1 Pax',
    pricePerHour: 20,
    surface: '25m Heated Pool',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA62v9e1HVltFSGb3ia-Ot9jqo5euNSy6HvDgSXVnQeurs5bxN2RuT-9brgECnWSDdk42dbndh3zsNVq5wNUmPSuLSmrpDN-bAecIRof_yBW-R_yzy4ruV9CB7JGtenypuHUZUaAqjDJftxgW-ecQ3EdkAMD541l7mSz1_OHjFTSYbxFzCJPdfVQHYdPKg_kDQG4uYpMHMMoJ1cegVsdqu-wKApSO69lVsX4QVdTf0OeQ6lPLC5xBnP3-F8oQ9JT6a0Vq8iqGlhJcI',
    isIndoor: true,
    description: 'A professional-grade swim lane equipped with high-tension anti-turbulence lane ropes, standard backstroke indicator masts, and an electronic starting block.',
    features: ['Heated Pool', 'Starting Blocks', 'Pace Clocks', 'Shower Rooms']
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Sofia Chen',
    email: 'sofia.chen@athletichub.com',
    phone: '+1 (555) 019-2834',
    dateOfBirth: '1989-10-14',
    memberSince: 'Oct 2024',
    bookingsCount: 42,
    status: 'Available',
    role: 'Admin'
  },
  {
    id: 'usr-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@athletichub.com',
    phone: '+1 (555) 017-9921',
    dateOfBirth: '1985-05-22',
    memberSince: 'Jan 2025',
    bookingsCount: 28,
    status: 'Available',
    role: 'Admin'
  },
  {
    id: 'usr-3',
    name: 'Alex Rivera',
    email: 'alex.rivera@athletichub.com',
    phone: '+1 (555) 012-3456',
    dateOfBirth: '1995-07-28',
    memberSince: 'Mar 2025',
    bookingsCount: 15,
    status: 'Available',
    role: 'Athlete'
  },
  {
    id: 'usr-4',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    phone: '+1 (555) 014-4829',
    dateOfBirth: '1992-12-03',
    memberSince: 'Apr 2025',
    bookingsCount: 8,
    status: 'Available',
    role: 'Athlete'
  },
  {
    id: 'usr-5',
    name: 'David Kojo',
    email: 'david.kojo@outlook.com',
    phone: '+1 (555) 015-7731',
    dateOfBirth: '1988-03-31',
    memberSince: 'May 2025',
    bookingsCount: 19,
    status: 'Booked',
    role: 'Athlete'
  },
  {
    id: 'usr-6',
    name: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    phone: '+1 (555) 018-1200',
    dateOfBirth: '1994-09-17',
    memberSince: 'Jun 2025',
    bookingsCount: 0,
    status: 'Suspended',
    role: 'Athlete'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    facilityId: 'fac-1',
    facilityName: 'Championship Court',
    facilityImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFPO0A4xcBC7FZ31yS_xtZ6OhkZ4RigUi1IPwrglKmKACde2amhmor-I3IKXubc98RqeY2El_N6TGs1dBXBoQlxWF13ONiTz7QYmJo9tjEEOqh1Acz1PfU-7G_6VCLG_D2e3vGfawKmVrsbr0VgouchsjFWW9006sX_9IIS319_jK7ce59-hlxheKFTFL1m8JBeV--wkjFfHEUgNqt9RI3wlZp_MEn_X1c0DMNBvdWbftDvnOeyCru7kaFrg43OkMxvyPryy5J0Pw',
    sport: 'Basketball',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@athletichub.com',
    date: '2026-07-21',
    timeSlot: '16:00 - 18:00',
    price: 100,
    status: 'Confirmed',
    equipment: ['Wilson Evolution Basketball (Size 7)', 'Bibs (Yellow)']
  },
  {
    id: 'res-102',
    facilityId: 'fac-3',
    facilityName: 'Pitch A - Synthetic Field',
    facilityImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGXyUhlyzlfUdX_4Q0W_8x3ad4BSds7AOxRDaVG_sGHTsOUntWRX-bex5-Vy_jJJ5Hy2HM1q_TfUZOkarh0kDJQ_RtaBUN8q8lw5OhInTfhDaQrkBoR6OeeBYmrtrdqqSodhEr9uICi3Vpd1NS-WwP4dKbStr1k9XJn9QVvP7Qh_LGQkfcdfRoH6IFiQtmEM9zccJIZ4X8Lyc0QqKEGaVK5Apzu4M5x4IbV8SKrMs-WbloFfDLe6PcxQX5n3_pjiOIGmkyQ3fRAE4',
    sport: 'Soccer',
    userName: 'David Kojo',
    userEmail: 'david.kojo@outlook.com',
    date: '2026-07-20',
    timeSlot: '18:00 - 20:00',
    price: 150,
    status: 'Confirmed',
    equipment: ['Match Ball (Size 5)', 'Agility Cones']
  },
  {
    id: 'res-103',
    facilityId: 'fac-2',
    facilityName: 'Court 3 - Clay Arena',
    facilityImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAujDlaKORQ3vfeSg1sm58FO2COMrnktnMa7OR3M2uLZ7BepfvubwrH9JFAJpGePw_ccYNV0rbVof2yIXf6pzF2IZJaEeJqZDIRiBHTDv0NoHEvnKqS5T94if1wBXPTcWRHFfqoiPziUN_jIYHK-tk7eNkWt5aP7lEhmuOYVffzGt6LLyOB90SHfGHUN31F0aw3O-aLxhYeEpYKQVj6aIsO7saZ04A0ZQ0QjdGweiPG6TvIwJD2nm2rzg0lC5TTsLF3eqh48tXXgew',
    sport: 'Tennis',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.jenkins@gmail.com',
    date: '2026-07-19',
    timeSlot: '09:00 - 11:00',
    price: 70,
    status: 'Completed',
    equipment: ['Babolat Pure Drive Racquet', 'Can of Dunlop Fort Balls']
  },
  {
    id: 'res-104',
    facilityId: 'fac-4',
    facilityName: 'Glass Padel Arena',
    facilityImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNdhoHwC_Jabx1hqo4V_LSEMkTYfwlYdpW9GI7hgfmCHp3qvjhvENGlePLnycHUQr-QLBMGwoAJZj8xIfc-VGIkUFl6QaDFyBVKAhFZfN1xWPTsSglKG585-vCOXluqEpvYCE-yCDHW2qsMgSY5ceE2KeUoElggqnfGvg_84eps30m7MgjoEDW7hNXwTLhw8Cl_eSWUr2G9pzAXW6WYhE9fskljGZxy3lb_5OSRyQcD6OG5gchTQtWwg28UlBrLTFwt_j0hXpDfpA',
    sport: 'Padel',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@athletichub.com',
    date: '2026-07-18',
    timeSlot: '14:00 - 16:00',
    price: 90,
    status: 'Completed',
    equipment: ['Babolat Padel Racquet', 'Padel Balls']
  },
  {
    id: 'res-105',
    facilityId: 'fac-1',
    facilityName: 'Championship Court',
    facilityImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFPO0A4xcBC7FZ31yS_xtZ6OhkZ4RigUi1IPwrglKmKACde2amhmor-I3IKXubc98RqeY2El_N6TGs1dBXBoQlxWF13ONiTz7QYmJo9tjEEOqh1Acz1PfU-7G_6VCLG_D2e3vGfawKmVrsbr0VgouchsjFWW9006sX_9IIS319_jK7ce59-hlxheKFTFL1m8JBeV--wkjFfHEUgNqt9RI3wlZp_MEn_X1c0DMNBvdWbftDvnOeyCru7kaFrg43OkMxvyPryy5J0Pw',
    sport: 'Basketball',
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@gmail.com',
    date: '2026-07-15',
    timeSlot: '10:00 - 12:00',
    price: 100,
    status: 'Cancelled',
    equipment: []
  }
];

export const AVAILABLE_TIME_SLOTS = [
  '07:00 - 09:00',
  '09:00 - 11:00',
  '11:00 - 13:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00'
];

export const SPORT_TYPES = [
  'Basketball',
  'Tennis',
  'Soccer',
  'Padel',
  'Aquatics'
];

export const EQUIPMENT_OPTIONS: Record<string, { name: string; price: number }[]> = {
  Basketball: [
    { name: 'Wilson Evolution Basketball', price: 5 },
    { name: 'Bibs / Pinnies Set (12x)', price: 10 },
    { name: 'Referee Whistle & Timer', price: 3 }
  ],
  Tennis: [
    { name: 'Babolat Pure Drive Racquet', price: 8 },
    { name: 'Can of Dunlop Fort Balls (x4)', price: 4 },
    { name: 'Ball Basket (50 balls)', price: 12 }
  ],
  Soccer: [
    { name: 'Adidas Match Ball', price: 5 },
    { name: 'Agility Cones & Markers Set', price: 6 },
    { name: 'Pinnies Set (10x)', price: 8 }
  ],
  Padel: [
    { name: 'Babolat Carbon Padel Racquet', price: 8 },
    { name: 'Can of Padel Balls (x3)', price: 4 },
    { name: 'Protective Eyewear', price: 2 }
  ],
  Aquatics: [
    { name: 'Training Kickboard', price: 2 },
    { name: 'Pull Buoy & Paddles Set', price: 3 },
    { name: 'Speedo Swimming Goggles', price: 4 }
  ]
};
