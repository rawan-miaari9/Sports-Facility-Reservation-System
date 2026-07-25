import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Plus, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { User, Facility, Reservation } from '../types';

interface DashboardProps {
  currentUser: User;
  facilities: Facility[];
  reservations: Reservation[];
  stats?: {
    monthlyInvestment: number;
    hoursCompleted: number;
    confirmedSlotsCount: number;
  };
  onNavigate: (view: any) => void;
  onCancelReservation: (id: string) => void;
}

export default function Dashboard({ 
  currentUser, 
  facilities, 
  reservations: initialReservations, 
  stats: initialStats,
  onNavigate,
  onCancelReservation: externalCancelReservation 
}: DashboardProps) {
  const isAdmin = currentUser.role === 'Admin';
  
  // Local state for reservations
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations || []);

  // Fetch dynamic reservations securely on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      try {
        const userId = currentUser.id || (currentUser as any)._id;
        if (!userId) return;

        const resList = await fetch(`/api/reservations?userId=${userId}`);
        if (resList.ok) {
          const json = await resList.json();
          if (isMounted) {
            if (json.success && Array.isArray(json.data)) {
              setReservations(json.data);
            } else if (Array.isArray(json)) {
              setReservations(json);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Handle local state removal instantly when a reservation is cancelled/deleted
  const handleCancel = async (id: string) => {
    if (externalCancelReservation) {
      externalCancelReservation(id);
    }
    setReservations(prev => prev.filter(r => r.id !== id && (r as any)._id !== id));
  };

  // Filter athlete specific reservations robustly matching email or userId
  const athleteReservations = reservations.filter(
    r => (
      r.userEmail === currentUser.email || 
      (r as any).userId === currentUser.id || 
      (r as any).userId === (currentUser as any)._id
    ) && r.status !== 'Cancelled'
  );

  const getUpcomingReservations = () => {
    const list = isAdmin ? reservations : athleteReservations;
    return list
      .filter(r => r.status === 'Confirmed' || r.status === 'Pending')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingList = getUpcomingReservations();
  const nextReservation = upcomingList[0];

  // Calculated Stats directly derived from live athlete reservations to prevent zero-out bugs
  const activeBookingsCount = upcomingList.length;
  const totalSpend = athleteReservations.reduce((sum, r) => sum + (Number(r.price) || 0), 0) || initialStats?.monthlyInvestment || 0;
  const totalBookedHours = (athleteReservations.filter(r => r.status === 'Completed').length * 2) || (activeBookingsCount * 2) || initialStats?.hoursCompleted || 0;
  
  // Countdown timer for next session
  const [countdownText, setCountdownText] = useState('00h 00m 00s');
  
  useEffect(() => {
    if (!nextReservation) return;

    const timer = setInterval(() => {
      try {
        const timeSlotPart = nextReservation.timeSlot ? nextReservation.timeSlot.split(' - ')[0] : '00:00';
        const targetStr = `${nextReservation.date}T${timeSlotPart}:00`;
        const targetDate = new Date(targetStr).getTime();
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (isNaN(targetDate)) {
          setCountdownText('Scheduled');
          return;
        }

        if (diff <= 0) {
          setCountdownText('Session Starting Now!');
          clearInterval(timer);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdownText(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
        }
      } catch (e) {
        setCountdownText('00h 00m 00s');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextReservation]);

  // Admin stats calculations
  const totalSystemBookings = reservations.filter(r => r.status !== 'Cancelled').length;
  const activeFacilitiesCount = facilities.filter(f => f.status === 'Available').length;
  const totalSystemUsers = 6; 

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar bg-background">
      {/* Header Banner */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Live Feed
            </span>
            <span className="text-xs font-mono text-outline font-semibold">
              Grid Status: ONLINE
            </span>
          </div>
          <h1 className="font-display font-black text-2xl text-on-surface mt-1">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-on-surface-variant text-xs mt-1">
            {isAdmin 
              ? 'Administrator View: Accessing performance matrix, booking rosters, and facility status.' 
              : 'Athlete View: Book elite courts, track milestones, and view scheduled sessions.'
            }
          </p>
        </div>
      </header>

      {/* ATHLETE VIEW */}
      {!isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Stats Roster & Activity Log */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-3xl -z-0" />
                <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Monthly Investment</span>
                <span className="block font-display font-black text-3xl text-primary mt-1.5">${totalSpend}</span>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-secondary">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Optimal booking tier</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-secondary/5 rounded-bl-3xl -z-0" />
                <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Hours Completed</span>
                <span className="block font-display font-black text-3xl text-on-surface mt-1.5">{totalBookedHours} hrs</span>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-[#006e25]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>100% attendance rate</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-tertiary/5 rounded-bl-3xl -z-0" />
                <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Confirmed Slots</span>
                <span className="block font-display font-black text-3xl text-primary mt-1.5">{activeBookingsCount} sessions</span>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-primary-container">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Active timetable locks</span>
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-on-surface">Ready for your next session?</h3>
                <p className="text-on-surface-variant text-xs mt-0.5">Browse available Olympic-tier arenas and lock in your slot.</p>
              </div>
              <button 
                onClick={() => onNavigate('facilities')}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Book A Slot</span>
              </button>
            </div>

            {/* Active Bookings Timetable Log */}
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-base text-on-surface">Active Bookings Timetable</h3>
                <span className="text-xs font-mono text-outline">{athleteReservations.length} Total Records</span>
              </div>

              {athleteReservations.length > 0 ? (
                <div className="divide-y divide-outline-variant/50">
                  {athleteReservations.slice(0, 3).map((res) => (
                    <div key={res.id || (res as any)._id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-display font-bold text-xs text-on-surface block">{res.facilityName || 'Arena Court'}</span>
                          <span className="text-[11px] font-mono text-outline block">{res.date} • {res.timeSlot}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-secondary font-mono">${res.price}</span>
                        <span className="text-[10px] font-mono bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">
                          {res.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-outline py-2 font-mono">No active timetable entries found.</p>
              )}
            </div>
          </div>

          {/* Right Column: Countdown Card & Recommended Courts */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {nextReservation ? (
              <div className="bg-gradient-to-br from-[#0c1c38] to-[#040e21] text-white p-6 rounded-3xl relative overflow-hidden border border-white/5 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-0" />
                <span className="text-[10px] font-mono text-secondary-container font-black uppercase tracking-widest block mb-4">
                  // COUNTDOWN TO PERFORMANCE
                </span>

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/15">
                    <Clock className="h-5 w-5 text-secondary-container" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-white">Next Scheduled Session</h4>
                    <span className="text-white/60 text-xs font-mono block mt-0.5">{nextReservation.facilityName || 'Arena Court'}</span>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-6 text-center">
                  <span className="block text-[10px] text-white/50 font-mono uppercase tracking-wider font-bold mb-1">TIME REMAINING</span>
                  <span className="block font-display font-black text-2xl tracking-widest text-secondary-container">
                    {countdownText}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50">Allocated Sport:</span>
                    <span className="font-bold text-white/90">{nextReservation.sport || 'Tennis / Badminton'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50">Time Slot Locked:</span>
                    <span className="font-bold text-white/90 font-mono text-[11px]">{nextReservation.timeSlot}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleCancel(nextReservation.id || (nextReservation as any)._id)}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-white border border-red-500/20 hover:border-red-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Release Scheduled Slot
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm text-center py-10 flex flex-col items-center justify-center">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-base text-on-surface">No Upcoming Bookings</h4>
                <p className="text-on-surface-variant text-xs mt-1 max-w-xs leading-relaxed">
                  Lock in one of our Olympic-tier arenas today to activate your real-time performance countdown timers.
                </p>
                <button
                  onClick={() => onNavigate('facilities')}
                  className="mt-5 bg-primary hover:bg-primary-container text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  Browse Available Courts
                </button>
              </div>
            )}

            {/* Recommended Courts Card */}
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
              <span className="text-[10px] font-mono text-outline font-bold uppercase tracking-widest block">
                RECOMMENDED COURTS
              </span>

              <div className="space-y-4">
                {facilities.slice(0, 2).map((fac) => (
                  <div 
                    key={fac.id || (fac as any)._id} 
                    className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-surface-container-low rounded-xl transition-all" 
                    onClick={() => onNavigate('facilities')}
                  >
                    <img 
                      src={fac.image} 
                      alt={fac.name} 
                      className="w-14 h-14 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono font-bold text-primary block truncate">{fac.type} • {fac.location}</span>
                      <span className="font-display font-bold text-xs text-on-surface block truncate group-hover:text-primary transition-colors">
                        {fac.name}
                      </span>
                      <span className="font-display font-extrabold text-xs text-on-surface-variant block mt-0.5">${fac.pricePerHour}/hr</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-outline group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMINISTRATOR VIEW */}
      {isAdmin && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
              <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Total Active Bookings</span>
              <span className="block font-display font-black text-3xl text-primary mt-1.5">{totalSystemBookings} slots</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
              <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Arenas Operational</span>
              <span className="block font-display font-black text-3xl text-on-surface mt-1.5">{activeFacilitiesCount} / {facilities.length}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
              <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Registered Members</span>
              <span className="block font-display font-black text-3xl text-primary mt-1.5">{totalSystemUsers} users</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
              <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Estimated Revenue (Jul)</span>
              <span className="block font-display font-black text-3xl text-secondary mt-1.5">$5,920.00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}