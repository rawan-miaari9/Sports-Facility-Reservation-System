"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  X, 
  Printer, 
  Sparkles,
  Info,
  Check,
  Receipt,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Reservation, User } from '../types';

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

  // Selected reservation details modal
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // Filter reservations based on user role and dynamic user info
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

  // SweetAlert Handler for Booking Cancellation
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

      {/* Control Roster Panel */}
      <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          {/* Status Tabs */}
          <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant overflow-x-auto">
            {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status as any)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === status 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                {status} List
              </button>
            ))}
          </div>

          {/* Search bar */}
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

                      {/* Athlete */}
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

                      {/* Status Badge */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wide ${
                          res.status === 'Confirmed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                            : res.status === 'Completed' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/60' 
                            : res.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            res.status === 'Confirmed' ? 'bg-emerald-500' :
                            res.status === 'Completed' ? 'bg-blue-500' :
                            res.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                          {res.status}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedRes(res)}
                            title="View Receipt"
                            className="inline-flex items-center gap-1 bg-surface-container hover:bg-primary hover:text-white text-on-surface-variant px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>

                          {res.status === 'Pending' && isAdmin && onApproveReservation && (
                            <button
                              onClick={() => onApproveReservation(targetId)}
                              title="Approve Booking"
                              className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {res.status === 'Confirmed' && (
                            <>
                              {isAdmin && (
                                <button
                                  onClick={() => onCompleteReservation(targetId)}
                                  title="Mark as Completed"
                                  className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Complete</span>
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleCancelClick(targetId, res.facilityName)}
                                title="Cancel Reservation"
                                className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            </>
                          )}

                          {/* Cancelled State Delete Option */}
                          {res.status === 'Cancelled' && (
                            <button
                              onClick={() => {
                                if (confirm('Delete this historical cancellation log?')) {
                                  onDeleteReservation(targetId);
                                }
                              }}
                              title="Delete Record"
                              className="text-outline hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
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

      {/* Advanced Receipt Details Modal Overlay */}
      {selectedRes && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-outline-variant shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-display font-black text-sm text-on-surface uppercase">COMPILATION RECEIPT</h3>
              </div>
              <button 
                onClick={() => setSelectedRes(null)}
                className="p-1.5 hover:bg-surface-container rounded-lg text-outline hover:text-on-surface cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-8 space-y-6">
              {/* Receipt Visual Header */}
              <div className="text-center space-y-1.5 pb-4 border-b border-outline-variant/60">
                <span className="font-display font-black text-2xl tracking-wider text-primary uppercase">
                  ATHLETIC<span className="text-primary-container">HUB</span>
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-outline uppercase font-bold">
                  Elite Performance Facility Receipt
                </span>
                <span className="block text-xs font-mono text-outline">
                  TRANSACTION ID: {selectedRes.id || (selectedRes as any)._id}
                </span>
              </div>

              {/* Breakdown detail rows */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs">
                <div>
                  <span className="block text-[9px] font-mono uppercase text-outline font-bold">Arena Reserved:</span>
                  <span className="font-display font-bold text-on-surface mt-0.5 block">{selectedRes.facilityName}</span>
                  <span className="text-[10px] text-outline font-mono">{selectedRes.sport || 'Facility'} Court</span>
                </div>

                <div>
                  <span className="block text-[9px] font-mono uppercase text-outline font-bold">Athlete Member:</span>
                  <span className="font-display font-bold text-on-surface mt-0.5 block">{selectedRes.userName}</span>
                  <span className="text-[10px] text-outline font-mono">{selectedRes.userEmail || 'N/A'}</span>
                </div>

                <div>
                  <span className="block text-[9px] font-mono uppercase text-outline font-bold">Scheduled Timetable:</span>
                  <span className="font-mono text-on-surface font-semibold mt-0.5 block">{selectedRes.date}</span>
                  <span className="font-mono text-outline text-[11px]">{selectedRes.timeSlot}</span>
                </div>

                <div>
                  <span className="block text-[9px] font-mono uppercase text-outline font-bold">Roster Line Status:</span>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                    selectedRes.status === 'Confirmed' 
                      ? 'bg-secondary-container text-on-secondary-container' 
                      : selectedRes.status === 'Completed' 
                      ? 'bg-primary-container text-white' 
                      : selectedRes.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-error-container text-error'
                  }`}>
                    {selectedRes.status}
                  </span>
                </div>
              </div>

              {/* Equipment list */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <span className="block text-[9px] font-mono text-outline uppercase font-bold tracking-widest mb-2">
                  ALLOCATED EQUIPMENT ROSTER
                </span>
                {!selectedRes.equipment || selectedRes.equipment.length === 0 ? (
                  <span className="text-xs text-outline font-semibold">No optional equipment hired.</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRes.equipment.map((eq, i) => (
                      <span key={i} className="bg-white border border-outline-variant text-on-surface-variant px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price details total */}
              <div className="flex justify-between items-center border-t border-outline-variant pt-4">
                <div>
                  <span className="block text-[9px] font-mono uppercase text-outline font-bold">Payment Method</span>
                  <span className="text-xs text-on-surface font-semibold">Secured via Athletic Membership Card</span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] font-mono uppercase text-outline font-bold">SECURED AMOUNT</span>
                  <span className="font-display font-black text-xl text-primary">${selectedRes.price}</span>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-outline-variant bg-surface-container-low flex justify-between gap-4">
              <button 
                onClick={() => {
                  window.print();
                }}
                className="bg-white hover:bg-surface-container border border-outline-variant text-on-surface-variant px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </button>
              <button 
                onClick={() => setSelectedRes(null)}
                className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Dismiss receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}