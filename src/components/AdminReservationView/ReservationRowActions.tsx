import React from 'react';
import { Receipt, Check, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { Reservation } from '../../types';

interface ReservationRowActionsProps {
  reservation: Reservation;
  isAdmin: boolean;
  onViewReceipt: (res: Reservation) => void;
  onApprove?: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string, facilityName: string) => void;
  onDelete: (id: string) => void;
}

export const ReservationRowActions: React.FC<ReservationRowActionsProps> = ({
  reservation,
  isAdmin,
  onViewReceipt,
  onApprove,
  onComplete,
  onCancel,
  onDelete,
}) => {
  const targetId = reservation.id || (reservation as any)._id;

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onViewReceipt(reservation)}
        title="View Receipt"
        className="inline-flex items-center gap-1 bg-surface-container hover:bg-primary hover:text-white text-on-surface-variant px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
      >
        <Receipt className="w-3.5 h-3.5" />
        <span>Receipt</span>
      </button>

      {reservation.status === 'Pending' && isAdmin && onApprove && (
        <button
          onClick={() => onApprove(targetId)}
          title="Approve Booking"
          className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Approve</span>
        </button>
      )}

      {reservation.status === 'Confirmed' && (
        <>
          {isAdmin && (
            <button
              onClick={() => onComplete(targetId)}
              title="Mark as Completed"
              className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete</span>
            </button>
          )}

          <button
            onClick={() => onCancel(targetId, reservation.facilityName)}
            title="Cancel Reservation"
            className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </>
      )}

      {reservation.status === 'Cancelled' && (
        <button
          onClick={() => {
            if (confirm('Delete this historical cancellation log?')) {
              onDelete(targetId);
            }
          }}
          title="Delete Record"
          className="text-outline hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};