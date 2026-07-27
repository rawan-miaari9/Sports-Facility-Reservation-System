"use client";

import React, { useState } from 'react';
import { Search, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import { Reservation, User } from '../../types';

import { ReservationStatusTabs } from './ReservationStatusTabs';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { ReservationRowActions } from './ReservationRowActions';
import { ReservationReceiptModal } from './ReservationReceiptModal';

interface ReservationsViewProps {
  currentUser: User;
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onCompleteReservation: (id: string) => void;
  onDeleteReservation: (id: string) => void;
  onApproveReservation?: (id: string) => void;
}

export default function ReservationsView({
  currentUser,
  reservations = [],
  onCancelReservation,
  onCompleteReservation,
  onDeleteReservation,
  onApproveReservation
}: ReservationsViewProps) {
  const isAdmin = currentUser?.role === 'admin';
  const userId = (currentUser as any)?.userId || (currentUser as any)?._id || (currentUser as any)?.id;
  const userEmail = currentUser?.email;

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // Filter reservations based on role and active tab
  const userFilteredList = isAdmin 
    ? reservations 
    : reservations.filter((r: any) => r.userId === userId || r.userEmail === userEmail);

  const finalFilteredReservations = userFilteredList.filter(res => {
    const facilityName = res.facilityName || '';
    const userName = res.userName || '';
    const bookingId = res.id || (res as any)._id || '';

    const matchesSearch = facilityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bookingId.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesTab = activeTab === 'All' || res.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleCancelClick = (targetId: string, facilityName: string) => {
    Swal.fire({
      title: 'Cancel Reservation?',
      text: `Are you sure you want to cancel the booking for "${facilityName}"? This slot will immediately be made available again.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Cancel It',
      cancelButtonText: 'Keep Booking',
      customClass: {
        popup: 'rounded-3xl font-sans',
        confirmButton: 'rounded-xl text-xs font-bold px-4 py-2.5',
        cancelButton: 'rounded-xl text-xs font-bold px-4 py-2.5'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onCancelReservation(targetId);
        Swal.fire({
          title: 'Cancelled!',
          text: 'The reservation has been successfully cancelled.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-3xl font-sans'
          }
        });
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar bg-background">
      {/* Title */}
      <header>
        <h1 className="font-display font-black text-2xl text-on-surface">
          Reservations History Log
        </h1>
      </header>

      {/* Filter Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <ReservationStatusTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-outline" />
            <input
              type="text"
              placeholder="Search by User, Arena"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
              id="reservations-search"
            />
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-2xl border border-outline-variant/80 shadow-sm overflow-hidden">
        {finalFilteredReservations.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Info className="h-10 w-10 text-outline mx-auto mb-3" />
            <span className="font-display font-bold text-base text-on-surface block">No Logs Registered</span>
            <span className="text-xs text-on-surface-variant max-w-sm mx-auto block mt-1 leading-relaxed">
              No reservation logs match the selected parameters. Clear search strings or status flags to reload.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/80 bg-surface-container-low/60 text-[10px] font-mono text-outline uppercase tracking-wider">
                  <th className="py-3.5 px-6 font-bold">Arena</th>
                  <th className="py-3.5 px-6 font-bold">USER</th>
                  <th className="py-3.5 px-6 font-bold">TIME</th>
                  <th className="py-3.5 px-6 font-bold text-right">Amount</th>
                  <th className="py-3.5 px-6 font-bold text-center">Status</th>
                  <th className="py-3.5 px-6 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-xs font-medium">
                {finalFilteredReservations.map((res) => {
                  const targetId = res.id || (res as any)._id;

                  return (
                    <tr key={targetId} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <span className="font-display font-bold text-on-surface block text-sm">
                          {res.facilityName}
                        </span>
                        <span className="text-[10px] font-mono text-outline block mt-0.5">
                          {res.sport || 'Facility'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="block text-on-surface font-semibold">{res.userName}</span>
                        <span className="block text-[10px] text-outline font-mono">{res.userEmail || 'N/A'}</span>
                      </td>

                      <td className="py-4 px-6 font-mono text-[11px]">
                        <span className="block text-on-surface font-semibold">{res.date}</span>
                        <span className="block text-outline mt-0.5">{res.timeSlot}</span>
                      </td>

                      <td className="py-4 px-6 text-right font-display font-black text-primary text-sm">
                        ${res.price}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <ReservationStatusBadge status={res.status} />
                      </td>

                      <td className="py-4 px-6">
                        <ReservationRowActions
                          reservation={res}
                          isAdmin={isAdmin}
                          onViewReceipt={setSelectedRes}
                          onApprove={onApproveReservation}
                          onComplete={onCompleteReservation}
                          onCancel={handleCancelClick}
                          onDelete={onDeleteReservation}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedRes && (
        <ReservationReceiptModal
          reservation={selectedRes}
          onClose={() => setSelectedRes(null)}
        />
      )}
    </div>
  );
}