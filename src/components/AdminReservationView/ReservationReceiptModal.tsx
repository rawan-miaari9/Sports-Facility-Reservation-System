import React from 'react';
import { Sparkles, X, Printer } from 'lucide-react';
import { Reservation } from '../../types';

interface ReservationReceiptModalProps {
  reservation: Reservation;
  onClose: () => void;
}

export const ReservationReceiptModal: React.FC<ReservationReceiptModalProps> = ({ reservation, onClose }) => {
  const targetId = reservation.id || (reservation as any)._id;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-outline-variant shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-display font-black text-sm text-on-surface uppercase">COMPILATION RECEIPT</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container rounded-lg text-outline hover:text-on-surface cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-6">
          <div className="text-center space-y-1.5 pb-4 border-b border-outline-variant/60">
            <span className="font-display font-black text-2xl tracking-wider text-primary uppercase">
              ATHLETIC<span className="text-primary-container">HUB</span>
            </span>
            <span className="block text-[9px] font-mono tracking-widest text-outline uppercase font-bold">
              Elite Performance Facility Receipt
            </span>
            <span className="block text-xs font-mono text-outline">
              TRANSACTION ID: {targetId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs">
            <div>
              <span className="block text-[9px] font-mono uppercase text-outline font-bold">Arena Reserved:</span>
              <span className="font-display font-bold text-on-surface mt-0.5 block">{reservation.facilityName}</span>
              <span className="text-[10px] text-outline font-mono">{reservation.sport || 'Facility'} Court</span>
            </div>

            <div>
              <span className="block text-[9px] font-mono uppercase text-outline font-bold">Athlete Member:</span>
              <span className="font-display font-bold text-on-surface mt-0.5 block">{reservation.userName}</span>
              <span className="text-[10px] text-outline font-mono">{reservation.userEmail || 'N/A'}</span>
            </div>

            <div>
              <span className="block text-[9px] font-mono uppercase text-outline font-bold">Scheduled Timetable:</span>
              <span className="font-mono text-on-surface font-semibold mt-0.5 block">{reservation.date}</span>
              <span className="font-mono text-outline text-[11px]">{reservation.timeSlot}</span>
            </div>

            <div>
              <span className="block text-[9px] font-mono uppercase text-outline font-bold">Roster Line Status:</span>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                reservation.status === 'Confirmed' 
                  ? 'bg-secondary-container text-on-secondary-container' 
                  : reservation.status === 'Completed' 
                  ? 'bg-primary-container text-white' 
                  : reservation.status === 'Pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-error-container text-error'
              }`}>
                {reservation.status}
              </span>
            </div>
          </div>

          {/* Equipment */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
            <span className="block text-[9px] font-mono text-outline uppercase font-bold tracking-widest mb-2">
              ALLOCATED EQUIPMENT ROSTER
            </span>
            {!reservation.equipment || reservation.equipment.length === 0 ? (
              <span className="text-xs text-outline font-semibold">No optional equipment hired.</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {reservation.equipment.map((eq, i) => (
                  <span key={i} className="bg-white border border-outline-variant text-on-surface-variant px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                    {eq}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="flex justify-between items-center border-t border-outline-variant pt-4">
            <div>
              <span className="block text-[9px] font-mono uppercase text-outline font-bold">Payment Method</span>
              <span className="text-xs text-on-surface font-semibold">Secured via Athletic Membership Card</span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] font-mono uppercase text-outline font-bold">SECURED AMOUNT</span>
              <span className="font-display font-black text-xl text-primary">${reservation.price}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-outline-variant bg-surface-container-low flex justify-between gap-4">
          <button 
            onClick={() => window.print()}
            className="bg-white hover:bg-surface-container border border-outline-variant text-on-surface-variant px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </button>
          <button 
            onClick={onClose}
            className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Dismiss receipt
          </button>
        </div>
      </div>
    </div>
  );
};