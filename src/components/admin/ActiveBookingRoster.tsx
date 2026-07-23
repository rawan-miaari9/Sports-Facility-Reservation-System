"use client";

import React from 'react';
import { Reservation } from '@/types/admin/admin';

interface RosterProps {
  reservations: Reservation[];
}

export default function ActiveBookingsRoster({ reservations }: RosterProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
      <span className="text-[10px] font-mono text-outline font-bold uppercase tracking-widest block mb-4">
        ACTIVE BOOKINGS ROSTER STREAM
      </span>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant text-[10px] font-mono text-outline uppercase tracking-wider">
              <th className="pb-3 font-bold">Roster ID</th>
              <th className="pb-3 font-bold">Facility / Arena</th>
              <th className="pb-3 font-bold">Athlete</th>
              <th className="pb-3 font-bold">Scheduled Slot</th>
              <th className="pb-3 font-bold text-right">Price</th>
              <th className="pb-3 font-bold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 text-xs font-medium">
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-surface-container-low/50">
                <td className="py-3 font-mono text-[11px] text-outline">{res.id}</td>
                <td className="py-3 font-display font-bold text-primary">{res.facilityName}</td>
                <td className="py-3 text-on-surface">{res.userName}</td>
                <td className="py-3 font-mono text-[11px]">{res.date} • {res.timeSlot}</td>
                <td className="py-3 text-right font-display font-bold">${res.price}</td>
                <td className="py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                      res.status === 'Confirmed'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : res.status === 'Completed'
                        ? 'bg-primary-container text-white'
                        : 'bg-error-container text-error'
                    }`}
                  >
                    {res.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}