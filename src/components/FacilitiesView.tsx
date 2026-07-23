import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Users, 
  Clock, 
  Compass, 
  X, 
  Calendar, 
  CheckSquare, 
  Square, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Eye, 
  Info,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Facility, User, Reservation } from '../types';
import { AVAILABLE_TIME_SLOTS, EQUIPMENT_OPTIONS, SPORT_TYPES } from '../mockData';

interface FacilitiesViewProps {
  currentUser: User;
  facilities: Facility[];
  reservations: Reservation[];
  onAddNewBooking: (res: Reservation) => void;
  onNavigateToManage: (facility: Facility | null) => void;
  deepSelectedFacility: Facility | null;
  onClearDeepSelected: () => void;
}

export default function FacilitiesView({
  currentUser,
  facilities,
  reservations,
  onAddNewBooking,
  onNavigateToManage,
  deepSelectedFacility,
  onClearDeepSelected
}: FacilitiesViewProps) {
  const isAdmin = currentUser.role === 'Admin';

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [indoorFilter, setIndoorFilter] = useState<'All' | 'Indoor' | 'Outdoor'>('All');
  const [maxPrice, setMaxPrice] = useState(100);

  // Side Drawer Booking Engine States
  const [isDrawerOpen, setIsDrawerOpen] = useState(deepSelectedFacility !== null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(deepSelectedFacility);
  const [bookingDate, setBookingDate] = useState<string>('2026-07-21');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  
  // Confirmation Overlay Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastCreatedReservation, setLastCreatedReservation] = useState<Reservation | null>(null);

  // If a deepselected facility was passed in from the landing page, open the drawer
  React.useEffect(() => {
    if (deepSelectedFacility) {
      setSelectedFacility(deepSelectedFacility);
      setIsDrawerOpen(true);
      onClearDeepSelected();
    }
  }, [deepSelectedFacility]);

  // Handle drawer open
  const handleOpenBookingDrawer = (facility: Facility) => {
    setSelectedFacility(facility);
    setSelectedSlot('');
    setSelectedEquipment([]);
    // Default booking date to tomorrow
    setBookingDate('2026-07-21');
    setIsDrawerOpen(true);
  };

  // Close Drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedFacility(null);
  };

  // Check if a time slot is already taken for the selected facility & date
  const isSlotTaken = (facilityId: string, date: string, slot: string) => {
    return reservations.some(
      r => r.facilityId === facilityId && r.date === date && r.timeSlot === slot && r.status !== 'Cancelled'
    );
  };

  // Equipment selection toggle
  const handleToggleEquipment = (eqName: string) => {
    if (selectedEquipment.includes(eqName)) {
      setSelectedEquipment(selectedEquipment.filter(name => name !== eqName));
    } else {
      setSelectedEquipment([...selectedEquipment, eqName]);
    }
  };

  // Filter facilities
  const filteredFacilities = facilities.filter(fac => {
    const matchesSearch = fac.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          fac.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'All' || fac.type === selectedSport;
    const matchesIndoor = indoorFilter === 'All' || 
                         (indoorFilter === 'Indoor' && fac.isIndoor) || 
                         (indoorFilter === 'Outdoor' && !fac.isIndoor);
    const matchesPrice = fac.pricePerHour <= maxPrice;

    return matchesSearch && matchesSport && matchesIndoor && matchesPrice;
  });

  // Calculate pricing
  const baseRate = selectedFacility ? selectedFacility.pricePerHour : 0;
  const bookedHours = 2; // Fixed 2 hours slots
  const basePrice = baseRate * bookedHours;
  
  // Calculate equipment rental cost
  const getEquipmentCost = () => {
    if (!selectedFacility) return 0;
    const list = EQUIPMENT_OPTIONS[selectedFacility.type] || [];
    return list
      .filter(eq => selectedEquipment.includes(eq.name))
      .reduce((sum, eq) => sum + eq.price, 0);
  };

  const totalBookingCost = basePrice + getEquipmentCost();

  // Create Reservation Submit
  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) return;
    
    if (!bookingDate) {
      alert('Please select a valid booking date.');
      return;
    }
    if (!selectedSlot) {
      alert('Please select a training time slot.');
      return;
    }

    const newRes: Reservation = {
      id: `res-${Math.floor(100 + Math.random() * 900)}`,
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      facilityImage: selectedFacility.image,
      sport: selectedFacility.type,
      userName: currentUser.name,
      userEmail: currentUser.email,
      date: bookingDate,
      timeSlot: selectedSlot,
      price: totalBookingCost,
      status: 'Confirmed',
      equipment: [...selectedEquipment]
    };

    onAddNewBooking(newRes);
    setLastCreatedReservation(newRes);
    setShowSuccessModal(true);
    handleCloseDrawer();
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-background relative h-full">
      {/* Main Facilities Area */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar">
        {/* Title */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="font-display font-black text-2xl text-on-surface">
              Certified Arena Directory
            </h1>
            <p className="text-on-surface-variant text-xs mt-0.5">
              Configure parameters to locate elite training courts and schedule dynamic timetable locks.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => onNavigateToManage(null)}
              className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              id="facilities-btn-add-new"
            >
              <Plus className="h-4.5 w-4.5" />
              Provision New Arena
            </button>
          )}
        </header>

        {/* Search & Advanced Filters Bar */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-outline" />
              <input
                type="text"
                placeholder="Search arenas by keywords, features, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
                id="facilities-search-text"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Sport Selector */}
              <div className="flex flex-col gap-1">
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="bg-white px-4 py-3 border border-outline-variant rounded-xl text-xs font-bold text-primary focus:outline-none cursor-pointer"
                  id="facilities-filter-sport"
                >
                  <option value="All">All Sports</option>
                  {SPORT_TYPES.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>

              {/* Indoor/Outdoor Selector */}
              <div>
                <select
                  value={indoorFilter}
                  onChange={(e) => setIndoorFilter(e.target.value as any)}
                  className="bg-white px-4 py-3 border border-outline-variant rounded-xl text-xs font-bold text-primary focus:outline-none cursor-pointer"
                >
                  <option value="All">All Environments</option>
                  <option value="Indoor">Indoors Only</option>
                  <option value="Outdoor">Outdoors Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Slide Range Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-outline-variant/60 pt-4 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-xs font-mono text-outline font-bold uppercase">Rate Cap:</span>
              <input 
                type="range"
                min="20"
                max="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="flex-1 accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer"
              />
              <span className="font-display font-black text-sm text-primary">${maxPrice}/hr</span>
            </div>

            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSport('All');
                setIndoorFilter('All');
                setMaxPrice(100);
              }}
              className="text-xs font-bold text-outline hover:text-primary transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-outline font-mono">
          <span>SHOWING {filteredFacilities.length} CERTIFIED ARENAS MATCHING SPECS</span>
          <span>GRID SECURE</span>
        </div>

        {/* Facilities Grid */}
        {filteredFacilities.length === 0 ? (
          <div className="bg-white border border-outline-variant p-16 rounded-2xl text-center">
            <Info className="h-10 w-10 text-outline mx-auto mb-3" />
            <span className="font-display font-bold text-base text-on-surface block">No Certified Arenas Found</span>
            <span className="text-xs text-on-surface-variant max-w-sm mx-auto block mt-1 leading-relaxed">
              Adjust your filter parameters or search terms to load available performance zones on the grid.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredFacilities.map((facility) => (
              <div 
                key={facility.id}
                className="bg-white rounded-2xl overflow-hidden border border-outline-variant hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image & Status Overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img 
                    src={facility.image} 
                    alt={facility.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-primary shadow-sm border border-outline-variant/60">
                    {facility.type}
                  </div>

                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold shadow-sm ${
                    facility.status === 'Available' 
                      ? 'bg-secondary-container text-on-secondary-container' 
                      : facility.status === 'Booked' 
                      ? 'bg-primary-container text-white' 
                      : 'bg-outline-variant text-[#424752]'
                  }`}>
                    {facility.status}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[11px] text-outline font-mono">
                      <MapPin className="h-3.5 w-3.5" />
                      {facility.location} • {facility.isIndoor ? 'Indoor' : 'Outdoor'}
                    </div>

                    <h3 className="font-display font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                      {facility.name}
                    </h3>

                    <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3">
                      {facility.description}
                    </p>

                    {/* Features Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {facility.features.map((feature, idx) => (
                        <span 
                          key={idx} 
                          className="bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded text-[9px] font-mono font-semibold"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-outline-variant mt-6 pt-4 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-mono uppercase tracking-wider text-outline font-bold">RATE</span>
                      <span className="font-display font-black text-lg text-primary">
                        ${facility.pricePerHour}
                        <span className="text-xs font-medium text-outline"> / hr</span>
                      </span>
                    </div>

                    {isAdmin ? (
                      <button
                        onClick={() => onNavigateToManage(facility)}
                        className="bg-surface-container hover:bg-primary hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold text-primary transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Edit Arena
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenBookingDrawer(facility)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          facility.status === 'Maintenance' 
                            ? 'bg-outline-variant/50 text-outline cursor-not-allowed' 
                            : 'bg-primary hover:bg-primary-container text-white shadow-md shadow-primary/10'
                        }`}
                        disabled={facility.status === 'Maintenance'}
                      >
                        Book Performance Slot
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Side Drawer Booking Engine */}
      {isDrawerOpen && selectedFacility && (
        <div className="absolute inset-0 bg-black/40 z-50 flex justify-end">
          {/* Dismiss Layer */}
          <div className="flex-1" onClick={handleCloseDrawer} />
          
          {/* Drawer content panel */}
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-outline-variant relative z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary text-white p-2 rounded-lg">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-sm text-on-surface">LOCK IN TIME SLOT</h2>
                  <span className="block text-[10px] text-outline font-mono font-bold tracking-wider uppercase">ATHLETICHUB SCHEDULER</span>
                </div>
              </div>
              <button 
                onClick={handleCloseDrawer}
                className="p-1.5 hover:bg-surface-container rounded-lg text-outline hover:text-on-surface transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Selected facility info brief */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex gap-3">
                <img 
                  src={selectedFacility.image} 
                  alt={selectedFacility.name} 
                  className="w-16 h-16 rounded-xl object-cover border"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                    {selectedFacility.type}
                  </span>
                  <h4 className="font-display font-bold text-xs text-on-surface mt-1.5 truncate">{selectedFacility.name}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-outline font-mono mt-1">
                    <Users className="h-3.5 w-3.5" /> Capacity: {selectedFacility.capacity}
                  </div>
                </div>
              </div>

              {/* Step 1: Select Date */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold flex items-center gap-1.5">
                  <span className="bg-primary text-white w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center font-bold">1</span>
                  Select Calendar Date
                </label>
                <input
                  type="date"
                  min="2026-07-20"
                  max="2026-07-27"
                  value={bookingDate}
                  onChange={(e) => {
                    setBookingDate(e.target.value);
                    setSelectedSlot(''); // Reset slot on date change
                  }}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface cursor-pointer"
                />
              </div>

              {/* Step 2: Select Time Slot */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold flex items-center gap-1.5">
                  <span className="bg-primary text-white w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center font-bold">2</span>
                  Select 2-Hour Training Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isBooked = isSlotTaken(selectedFacility.id, bookingDate, slot);
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => !isBooked && setSelectedSlot(slot)}
                        disabled={isBooked}
                        className={`py-3 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                          isBooked 
                            ? 'bg-outline-variant/30 border-outline-variant text-outline/65 cursor-not-allowed flex items-center justify-center gap-1' 
                            : isSelected 
                            ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-102' 
                            : 'bg-surface-container-low hover:bg-surface-container border-outline-variant text-on-surface cursor-pointer'
                        }`}
                      >
                        {isBooked ? (
                          <>
                            <Lock className="h-3 w-3" /> Fully Booked
                          </>
                        ) : slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Equipment Checklist */}
              {EQUIPMENT_OPTIONS[selectedFacility.type] && (
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold flex items-center gap-1.5">
                    <span className="bg-primary text-white w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center font-bold">3</span>
                    Optional Equipment Hiring
                  </label>
                  <div className="space-y-2 bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                    {EQUIPMENT_OPTIONS[selectedFacility.type].map((eq) => {
                      const isChecked = selectedEquipment.includes(eq.name);

                      return (
                        <button
                          key={eq.name}
                          type="button"
                          onClick={() => handleToggleEquipment(eq.name)}
                          className="w-full flex items-center justify-between py-2 text-left text-xs font-semibold hover:text-primary transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {isChecked ? (
                              <CheckSquare className="h-4.5 w-4.5 text-primary shrink-0" />
                            ) : (
                              <Square className="h-4.5 w-4.5 text-outline shrink-0" />
                            )}
                            <span className="text-on-surface">{eq.name}</span>
                          </div>
                          <span className="font-mono text-primary font-bold">+${eq.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Checkout Summary & Submit */}
            <div className="p-6 border-t border-outline-variant bg-surface-container-low space-y-4">
              <div className="space-y-1.5">
                <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-wider">PAYMENT BILLING BREAKDOWN</span>
                
                <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium">
                  <span>Base Arena Rate ({bookedHours} hrs):</span>
                  <span>${basePrice}</span>
                </div>

                {selectedEquipment.length > 0 && (
                  <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium">
                    <span>Equipment Rental Roster:</span>
                    <span>${getEquipmentCost()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm font-bold text-on-surface pt-2 border-t border-outline-variant/60">
                  <span className="font-display">Total Rental Rate:</span>
                  <span className="font-display font-black text-lg text-primary">${totalBookingCost}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmReservation}
                disabled={!selectedSlot}
                className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedSlot 
                    ? 'bg-primary hover:bg-primary-container text-white shadow-lg shadow-primary/10' 
                    : 'bg-outline-variant/60 text-outline cursor-not-allowed'
                }`}
                id="facilities-btn-confirm-booking"
              >
                Confirm Performance Lock
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Booking Modal Overlay */}
      {showSuccessModal && lastCreatedReservation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full border border-outline-variant shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="bg-secondary/15 text-secondary p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-on-surface">RESERVATION CONFIRMED!</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Your performance time lock is registered in the database grid. Receipt details and system references are compiled below.
              </p>
            </div>

            <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/60 text-left space-y-2.5 font-mono text-[11px] text-on-surface-variant">
              <div className="flex justify-between">
                <span className="font-bold uppercase">Booking ID:</span>
                <span className="font-bold text-primary">{lastCreatedReservation.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold uppercase">Arena Reserved:</span>
                <span className="font-bold text-on-surface">{lastCreatedReservation.facilityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold uppercase">Scheduled Time:</span>
                <span className="font-bold text-on-surface">{lastCreatedReservation.date} • {lastCreatedReservation.timeSlot}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant/60 text-xs font-bold text-on-surface">
                <span className="font-display">TOTAL SECURED:</span>
                <span className="font-display text-primary">${lastCreatedReservation.price}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              id="facilities-btn-success-close"
            >
              Secure & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
