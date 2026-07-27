"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Check, X, Loader2, CalendarX2 } from 'lucide-react';

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
  onRejectBooking?: (bookingId: string) => Promise<void> | void;
}

export default function ActiveBookingsRoster({ 
  reservations = [], 
  onApproveBooking,
  onRejectBooking 
}: RosterProps) {
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Helper function to check if a reservation date is strictly before today
  const isPastDate = (dateStr: string) => {
    if (!dateStr) return false;
    const bookingDate = new Date(dateStr);
    const today = new Date();
    // Reset time to midnight for pure date-to-date comparison
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    return bookingDate < today;
  };

  // Automatically trigger rejection for any pending bookings that have passed their date
  useEffect(() => {
    if (!onRejectBooking) return;

    const expiredPendingBookings = reservations.filter(
      (res) => res.status === 'Pending' && isPastDate(res.date)
    );

    expiredPendingBookings.forEach((expired) => {
      const targetId = expired.id || expired._id;
      if (targetId) {
        onRejectBooking(targetId);
      }
    });
  }, [reservations, onRejectBooking]);

  // Filter list to keep only active (non-expired) Pending bookings
  const pendingReservations = useMemo(() => {
    return reservations.filter((res) => {
      if (res.status !== 'Pending') return false;
      if (isPastDate(res.date)) return false;
      return true;
    });
  }, [reservations]);

  const handleApprove = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleReject = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onRejectBooking) return;
    setRejectingId(id);
    try {
      await onRejectBooking(id);
    } catch (err) {
      console.error("Failed to reject booking:", err);
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200">
      {/* Roster Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
            Pending Approval Roster
          </span>
          <h3 className="text-sm font-semibold text-slate-800 mt-0.5">
            Bookings Awaiting Confirmation
          </h3>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-xs font-semibold font-mono tracking-tight">
            {pendingReservations.length} Pending
          </span>
        </div>
      </div>

      {/* Roster Table Content */}
      {pendingReservations.length === 0 ? (
        <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <CalendarX2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-600">No pending bookings</p>
          <p className="text-[11px] text-slate-400 mt-0.5">All incoming reservations have been reviewed.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6 font-semibold">Facility</th>
                <th className="py-3 px-4 font-semibold">Client / Athlete</th>
                <th className="py-3 px-4 font-semibold">Schedule Slot</th>
                <th className="py-3 px-4 font-semibold text-right">Price</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {pendingReservations.map((res) => {
                const targetId = res.id || res._id || '';
                const clientName = res.userName || res.guestName || 'Guest User';
                const isApproving = approvingId === targetId;
                const isRejecting = rejectingId === targetId;
                const isProcessing = isApproving || isRejecting;

                return (
                  <tr 
                    key={targetId} 
                    className="hover:bg-slate-50/80 transition-colors duration-150 group"
                  >
                    {/* Facility Name */}
                    <td className="py-3.5 px-6 font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {res.facilityName}
                    </td>

                    {/* Client Name */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {clientName}
                    </td>

                    {/* Date and Time */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      <span className="font-semibold text-slate-700">{res.date}</span>
                      <span className="text-slate-300 mx-1.5">•</span>
                      <span>{res.timeSlot}</span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right font-semibold font-mono text-slate-900">
                      ${res.price}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold font-mono bg-amber-50 text-amber-700 border border-amber-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Pending
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Approve Button */}
                        <button
                          type="button"
                          onClick={(e) => handleApprove(e, targetId)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium text-xs rounded-lg transition-all shadow-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                          {isApproving ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          <span>Approve</span>
                        </button>

                        {/* Reject Button */}
                        <button
                          type="button"
                          onClick={(e) => handleReject(e, targetId)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 active:scale-95 text-slate-600 font-medium text-xs rounded-lg border border-slate-200/80 hover:border-rose-200 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        >
                          {isRejecting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                          ) : (
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          <span>Reject</span>
                        </button>
                      </div>
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