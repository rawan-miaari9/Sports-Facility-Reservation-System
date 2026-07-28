'use client';

import React from 'react';
import {
  Calendar,
  X,
  Users,
  Lock,
  CreditCard,
  Banknote,
  CheckSquare,
  Square,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Facility, Reservation } from './FacilitiesView';

interface BookingDrawerProps {
  selectedFacility: Facility;
  bookingDate: string;
  setBookingDate: (date: string) => void;
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
  paymentMethod: 'Card' | 'Cash';
  setPaymentMethod: (method: 'Card' | 'Cash') => void;
  selectedEquipment: string[];
  onToggleEquipment: (name: string) => void;
  availableTimeSlots: string[];
  equipmentOptions: Record<string, { name: string; price: number }[]>;
  reservations: Reservation[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;

  bookingType: "registered" | "guest";
  setBookingType: (type: "registered" | "guest") => void;

  guestName: string;
  setGuestName: (value: string) => void;

  guestPhone: string;
  setGuestPhone: (value: string) => void;

  guestEmail: string;
  setGuestEmail: (value: string) => void;

  isAdmin: boolean;
}

export function BookingDrawer({
  selectedFacility,
  bookingDate,
  setBookingDate,
  selectedSlot,
  setSelectedSlot,
  paymentMethod,
  setPaymentMethod,
  selectedEquipment,
  onToggleEquipment,
  availableTimeSlots,
  equipmentOptions,
  reservations,
  isSubmitting,

  bookingType,
  setBookingType,

  guestName,
  setGuestName,

  guestPhone,
  setGuestPhone,

  guestEmail,
  setGuestEmail,

  isAdmin,

  onClose,
  onSubmit
}: BookingDrawerProps) {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const isSlotTaken = (facilityId: string, date: string, slot: string) => {
    return reservations.some(
      r => (r.facilityId === facilityId || (r as any).facility === facilityId) &&
        r.date === date &&
        r.timeSlot === slot &&
        r.status !== 'Cancelled'
    );
  };

  const baseRate = selectedFacility.pricePerHour;
  const bookedHours = 2;
  const basePrice = baseRate * bookedHours;

  const equipmentCost = (equipmentOptions[selectedFacility.type] || [])
    .filter(eq => selectedEquipment.includes(eq.name))
    .reduce((sum, eq) => sum + eq.price, 0);

  const totalBookingCost = basePrice + equipmentCost;

  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex justify-end">
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-outline-variant relative z-10 animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-sm text-on-surface">LOCK IN TIME SLOT</h2>
              <span className="block text-[10px] text-outline font-mono font-bold tracking-wider uppercase">ATHLETICHUB SCHEDULER</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container rounded-lg text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex gap-3">
            <img
              src={selectedFacility.image}
              alt={selectedFacility.name}
              className="w-16 h-16 rounded-xl object-cover border"
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
          {isAdmin && (
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
                Booking Type
              </label>

              <div className="p-3 rounded-xl border border-outline-variant bg-surface-container-low">
                Guest Booking
              </div>
            </div>
          )}

          {isAdmin && bookingType === "guest" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Guest Full Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm"
              />

              <input
                type="text"
                placeholder="Guest Phone Number"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm"
              />

              <input
                type="email"
                placeholder="Guest Email (Optional)"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm"
              />
            </div>
          )}
          {/* Step 1 */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold flex items-center gap-1.5">
              <span className="bg-primary text-white w-4 h-4 text-[10px] rounded-full flex items-center justify-center font-bold">1</span>
              Select Calendar Date
            </label>
            <input
              type="date"
              min={getTodayString()}
              value={bookingDate}
              onChange={(e) => {
                setBookingDate(e.target.value);
                setSelectedSlot('');
              }}
              className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface cursor-pointer"
            />
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold flex items-center gap-1.5">
              <span className="bg-primary text-white w-4 h-4 text-[10px] rounded-full flex items-center justify-center font-bold">2</span>
              Select 2-Hour Training Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableTimeSlots.map((slot) => {
                const isBooked = isSlotTaken(selectedFacility._id || selectedFacility.id!, bookingDate, slot);
                const isSelected = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => !isBooked && setSelectedSlot(slot)}
                    disabled={isBooked}
                    className={`py-3 px-2 rounded-xl text-xs font-bold text-center border transition-all ${isBooked
                      ? 'bg-outline-variant/30 border-outline-variant text-outline/65 cursor-not-allowed flex items-center justify-center gap-1'
                      : isSelected
                        ? 'bg-primary border-primary text-white shadow-md scale-102'
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

          {/* Step 3 */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold flex items-center gap-1.5">
              <span className="bg-primary text-white w-4 h-4 text-[10px] rounded-full flex items-center justify-center font-bold">3</span>
              Select Payment Option
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${paymentMethod === 'Cash'
                  ? 'border-primary bg-primary/5 text-primary font-bold'
                  : 'border-outline-variant text-on-surface-variant'
                  }`}
              >
                <Banknote className="h-5 w-5" />
                <span className="text-xs">Cash Payment</span>
                <span className="text-[9px] text-amber-600 font-mono">Requires Admin Approval</span>
              </button>
            </div>
          </div>

        </div>

        {/* Breakdown */}
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
                <span>${equipmentCost}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-bold text-on-surface pt-2 border-t border-outline-variant/60">
              <span className="font-display">Total Rental Rate:</span>
              <span className="font-display font-black text-lg text-primary">${totalBookingCost}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!selectedSlot || isSubmitting}
            className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${selectedSlot && !isSubmitting
              ? 'bg-primary hover:bg-primary-container text-white shadow-lg'
              : 'bg-outline-variant/60 text-outline cursor-not-allowed'
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving Booking...
              </>
            ) : (
              <>
                Confirm Performance Lock
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}