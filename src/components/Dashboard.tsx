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
  reservations: initialReservations = [], 
  stats: initialStats,
  onNavigate,
  onCancelReservation: externalCancelReservation 
}: DashboardProps) {
  const isAdmin = currentUser?.role === 'admin';
  
  // Initialize state with props immediately so the screen is never blank
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);

  // Fetch from the API safely on load
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        if (!currentUser) return;
        const userId = currentUser.id || (currentUser as any)._id || '';
        const role = currentUser.role || 'Athlete';

        const url = `/api/reservations?userId=${userId}&role=${role}`;
        console.log("Fetching dashboard reservations from:", url);

        const res = await fetch(url);
        const json = await res.json();

        if (isMounted && res.ok && json.success) {
          if (Array.isArray(json.data) && json.data.length > 0) {
            setReservations(json.data);
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error (using fallback props):", err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Safe filtering for athlete view
  const athleteReservations = reservations.filter(r => {
    if (isAdmin) return r.status !== 'Cancelled';
    if (!currentUser) return true;

    const userEmail = currentUser.email;
    const currentUserId = currentUser.id || (currentUser as any)._id;
    
    const matchesEmail = userEmail && r.userEmail && r.userEmail.toLowerCase() === userEmail.toLowerCase();
    const resUserId = (r as any).userId || (r as any).user;
    const matchesId = resUserId && currentUserId && String(resUserId) === String(currentUserId);

    return (matchesEmail || matchesId || !resUserId) && r.status !== 'Cancelled';
  });

  const activeReservationsToDisplay = athleteReservations.length > 0 ? athleteReservations : reservations;

  const getUpcomingReservations = () => {
    const list = isAdmin ? reservations : activeReservationsToDisplay;
    return list
      .filter(r => r.status === 'Confirmed' || r.status === 'Pending')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingList = getUpcomingReservations();
  const nextReservation = upcomingList[0];

  const activeBookingsCount = upcomingList.length;
  const totalSpend = activeReservationsToDisplay.reduce((sum, r) => sum + (Number(r.price) || 0), 0) || initialStats?.monthlyInvestment || 0;
  const totalBookedHours = (activeReservationsToDisplay.filter(r => r.status === 'Completed').length * 2) || (activeBookingsCount * 2) || initialStats?.hoursCompleted || 0;
  
  // Countdown timer for next session
  const [countdownText, setCountdownText] = useState('00h 00m 00s');
  
  useEffect(() => {
    if (!nextReservation) return;

    const timer = setInterval(() => {
      try {
        let rawTime = nextReservation.timeSlot || '00:00';
        if (rawTime.includes('-')) {
          rawTime = rawTime.split('-')[0].trim();
        }

        const cleanDate = nextReservation.date ? nextReservation.date.split('T')[0] : '';
        const targetStr = `${cleanDate}T${rawTime}:00`;
        
        const targetDate = new Date(targetStr).getTime();
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (!cleanDate || isNaN(targetDate)) {
          setCountdownText('Scheduled');
          return;
        }

        if (diff <= 0) {
          setCountdownText('Session Started / Past');
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

  const totalSystemBookings = reservations.filter(r => r.status !== 'Cancelled').length;
  const activeFacilitiesCount = facilities.filter(f => f.status === 'Available').length;
  const totalSystemUsers = 6; 

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar bg-background">
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
            Welcome back, {currentUser?.name || 'Athlete'}
          </h1>
          <p className="text-on-surface-variant text-xs mt-1">
            {isAdmin 
              ? 'Administrator View: Accessing performance matrix, booking rosters, and facility status.' 
              : 'Athlete View: Book elite courts, track milestones, and view scheduled sessions.'
            }
          </p>
        </div>
      </header>

      {!isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden group">
                <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Monthly Investment</span>
                <span className="block font-display font-black text-3xl text-primary mt-1.5">${totalSpend}</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden group">
                <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Hours Completed</span>
                <span className="block font-display font-black text-3xl text-on-surface mt-1.5">{totalBookedHours} hrs</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden group">
                <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Confirmed Slots</span>
                <span className="block font-display font-black text-3xl text-primary mt-1.5">{activeBookingsCount} sessions</span>
              </div>
            </div>

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

            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-base text-on-surface">Active Bookings Timetable</h3>
                <span className="text-xs font-mono text-outline">{activeReservationsToDisplay.length} Total Records</span>
              </div>

              {activeReservationsToDisplay.length > 0 ? (
                <div className="divide-y divide-outline-variant/50">
                  {activeReservationsToDisplay.slice(0, 3).map((res) => (
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

          <div className="lg:col-span-4 flex flex-col gap-8">
            {nextReservation ? (
              <div className="bg-gradient-to-br from-[#0c1c38] to-[#040e21] text-white p-6 rounded-3xl relative overflow-hidden border border-white/5 shadow-xl">
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

                <div className="text-center text-xs text-slate-400 italic font-mono pt-2 border-t border-white/10">
                  Manage or modify sessions via your bookings management tab.
                </div>
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
          </div>
        </div>
      )}

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
          </div>
        </div>
      )}
    </div>
  );
}