import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Trash2, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Printer, 
  Sparkles,
  Info
} from 'lucide-react';
import { Reservation, User } from '../types';

interface ReservationsViewProps {
  currentUser: User;
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onCompleteReservation: (id: string) => void;
  onDeleteReservation: (id: string) => void;
}

export default function ReservationsView({
  currentUser,
  reservations,
  onCancelReservation,
  onCompleteReservation,
  onDeleteReservation
}: ReservationsViewProps) {
  const isAdmin = currentUser.role === 'admin';

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');

  // Selected reservation details modal
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // Filter reservations based on user role and filters
  const userFilteredList = isAdmin 
    ? reservations 
    : reservations.filter(r => r.userEmail === currentUser.email);

  const finalFilteredReservations = userFilteredList.filter(res => {
    const matchesSearch = res.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || res.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar bg-background">
      {/* Title */}
      <header>
        <h1 className="font-display font-black text-2xl text-on-surface">
          Reservations History Log
        </h1>
        <p className="text-on-surface-variant text-xs mt-0.5">
          {isAdmin 
            ? 'Administrator Database: Monitor court times, adjust statuses, and manage global team schedules.' 
            : 'Personal Roster Log: View completed games, upcoming schedules, and download receipt packages.'
          }
        </p>
      </header>

      {/* Control Roster Panel */}
      <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          {/* Status Tabs */}
          <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant overflow-x-auto">
            {['All', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
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
              placeholder="Search by ID, athlete, or arena..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
              id="reservations-search"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
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
                <tr className="border-b border-outline-variant bg-surface-container-low/50 text-[10px] font-mono text-outline uppercase tracking-wider">
                  <th className="py-4 px-6 font-bold">Booking ID</th>
                  <th className="py-4 px-6 font-bold">Arena Details</th>
                  <th className="py-4 px-6 font-bold">Athlete / Member</th>
                  <th className="py-4 px-6 font-bold">Scheduled Timetable</th>
                  <th className="py-4 px-6 font-bold text-right">Amount</th>
                  <th className="py-4 px-6 font-bold text-center">Status</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-xs font-medium">
                {finalFilteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-surface-container-low/30 transition-colors">
                    {/* ID */}
                    <td className="py-4 px-6 font-mono text-[11px] text-outline">
                      {res.id}
                    </td>

                    {/* Arena */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={res.facilityImage} 
                          alt={res.facilityName} 
                          className="w-11 h-11 rounded-xl object-cover border"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-display font-bold text-primary block">{res.facilityName}</span>
                          <span className="text-[10px] font-mono text-outline block mt-0.5">{res.sport}</span>
                        </div>
                      </div>
                    </td>

                    {/* Athlete */}
                    <td className="py-4 px-6">
                      <span className="block text-on-surface">{res.userName}</span>
                      <span className="block text-[10px] text-outline font-mono">{res.userEmail}</span>
                    </td>

                    {/* Schedule */}
                    <td className="py-4 px-6 font-mono text-[11px]">
                      <span className="block text-on-surface">{res.date}</span>
                      <span className="block text-outline mt-0.5">{res.timeSlot}</span>
                    </td>

                    {/* Spend */}
                    <td className="py-4 px-6 text-right font-display font-black text-primary text-sm">
                      ${res.price}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        res.status === 'Confirmed' 
                          ? 'bg-secondary-container text-on-secondary-container' 
                          : res.status === 'Completed' 
                          ? 'bg-primary-container text-white' 
                          : res.status === 'Cancelled' 
                          ? 'bg-error-container text-error'
                          : 'bg-tertiary-container/20 text-on-tertiary-container'
                      }`}>
                        {res.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedRes(res)}
                        className="bg-surface-container hover:bg-primary hover:text-white text-primary px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Receipt
                      </button>

                      {res.status === 'Confirmed' && (
                        <>
                          {isAdmin && (
                            <button
                              onClick={() => onCompleteReservation(res.id)}
                              className="bg-secondary-container hover:bg-secondary hover:text-white text-on-secondary-container px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this scheduled reservation? This releases the slot immediately.')) {
                                onCancelReservation(res.id);
                              }
                            }}
                            className="bg-error-container hover:bg-error hover:text-white text-error px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {res.status === 'Cancelled' && (
                        <button
                          onClick={() => {
                            if (confirm('Delete this historical cancellation log?')) {
                              onDeleteReservation(res.id);
                            }
                          }}
                          className="text-outline hover:text-error p-1.5 rounded-lg hover:bg-error-container transition-all cursor-pointer inline-flex items-center"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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
                <span className="block text-xs font-mono text-outline">TRANSACTION ID: {selectedRes.id}</span>
              </div>

              {/* Breakdown detail rows */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs">
                <div>
                  <span className="block text-[9px] font-mono uppercase text-outline font-bold">Arena Reserved:</span>
                  <span className="font-display font-bold text-on-surface mt-0.5 block">{selectedRes.facilityName}</span>
                  <span className="text-[10px] text-outline font-mono">{selectedRes.sport} Court</span>
                </div>

                <div>
                  <span className="block text-[9px] font-mono uppercase text-outline font-bold">Athlete Member:</span>
                  <span className="font-display font-bold text-on-surface mt-0.5 block">{selectedRes.userName}</span>
                  <span className="text-[10px] text-outline font-mono">{selectedRes.userEmail}</span>
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
                      : 'bg-error-container text-error'
                  }`}>
                    {selectedRes.status}
                  </span>
                </div>
              </div>

              {/* Equipment list */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <span className="block text-[9px] font-mono text-outline uppercase font-bold tracking-widest mb-2">ALLOCATED EQUIPMENT ROSTER</span>
                {selectedRes.equipment.length === 0 ? (
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
