'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Reservation } from './FacilitiesView';

interface BookingSuccessModalProps {
  reservation: Reservation;
  onClose: () => void;
}

export function BookingSuccessModal({ reservation, onClose }: BookingSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl max-w-md w-full border border-outline-variant shadow-2xl text-center space-y-6 animate-in fade-in duration-200">
        <div className="bg-emerald-100 text-emerald-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-black text-xl text-on-surface">RESERVATION SUBMITTED!</h3>
          <p className="text-on-surface-variant text-xs leading-relaxed">
            {reservation.paymentMethod === 'Cash'
              ? 'Your reservation is registered as PENDING. An Admin will approve it upon cash verification.'
              : 'Your payment was completed and your reservation is SCHEDULED.'}
          </p>
        </div>

        <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/60 text-left space-y-2.5 font-mono text-[11px] text-on-surface-variant">
          <div className="flex justify-between">
            <span className="font-bold uppercase">Booking ID:</span>
            <span className="font-bold text-primary">{reservation._id || reservation.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold uppercase">Arena Reserved:</span>
            <span className="font-bold text-on-surface">{reservation.facilityName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold uppercase">Status:</span>
            <span className={`font-bold ${reservation.status === 'Confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {reservation.status}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-outline-variant/60 text-xs font-bold text-on-surface">
            <span className="font-display">TOTAL SECURED:</span>
            <span className="font-display text-primary">${reservation.price} ({reservation.paymentMethod})</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Secure & Continue
        </button>
      </div>
    </div>
  );
}