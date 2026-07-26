"use client";

import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

export interface PendingReservation {
  id: string;
  _id?: string;
  facilityName: string;
  userName: string;
  guestName?: string;
  date: string;
  timeSlot: string;
  price: number;
  paymentMethod?: string;
  status: "Pending" | "Confirmed" | "Cancelled";
}

interface RosterProps {
  reservations: PendingReservation[];
  onApproveBooking?: (bookingId: string) => Promise<void> | void;
}

export default function ActiveBookingsRoster({ reservations = [], onApproveBooking }: RosterProps) {
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Filter strictly for Pending bookings
  const pendingReservations = reservations.filter((res) => res.status === 'Pending');

  const handleApprove = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault(); // Stop form submission if inside a form
    e.stopPropagation(); // Stop event bubbling

    if (!onApproveBooking) return;
    setApprovingId(id);
    try {
      await onApproveBooking(id);
    } catch (err) {
      console.error("Failed to approve booking:", err);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono text-outline font-bold uppercase tracking-widest block">
          PENDING APPROVAL ROSTER
        </span>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
          {pendingReservations.length} Pending
        </span>
      </div>

      {pendingReservations.length === 0 ? (
        <div className="py-8 text-center text-xs text-outline font-medium">
          No pending bookings waiting for approval.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant text-[10px] font-mono text-outline uppercase tracking-wider">
                <th className="pb-3 font-bold">Booking ID</th>
                <th className="pb-3 font-bold">Facility</th>
                <th className="pb-3 font-bold">Client / Athlete</th>
                <th className="pb-3 font-bold">Slot</th>
                <th className="pb-3 font-bold text-right">Price</th>
                <th className="pb-3 font-bold text-center">Status</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 text-xs font-medium">
              {pendingReservations.map((res) => {
                const targetId = res.id || res._id || '';
                const clientName = res.userName || res.guestName || 'Guest User';
                const isApproving = approvingId === targetId;

                return (
                  <tr key={targetId} className="hover:bg-surface-container-low/50">
                    <td className="py-3 font-mono text-[11px] text-outline">
                      {targetId.length > 8 ? targetId.slice(-6) : targetId}
                    </td>
                    <td className="py-3 font-display font-bold text-primary">
                      {res.facilityName}
                    </td>
                    <td className="py-3 text-on-surface">{clientName}</td>
                    <td className="py-3 font-mono text-[11px]">
                      {res.date} • {res.timeSlot}
                    </td>
                    <td className="py-3 text-right font-display font-bold">
                      ${res.price}
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Pending
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => handleApprove(e, targetId)}
                        disabled={isApproving}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        {isApproving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Approve</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}