import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CircleDollarSign, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Sparkles,
  ChevronRight,
  Tv,
  ArrowUpRight
} from 'lucide-react';
import { User, Facility, Reservation } from '../types';

interface DashboardProps {
  currentUser: User;
  facilities: Facility[];
  reservations: Reservation[];
  onNavigate: (view: any) => void;
  onCancelReservation: (id: string) => void;
}

export default function Dashboard({ 
  currentUser, 
  facilities, 
  reservations, 
  onNavigate,
  onCancelReservation 
}: DashboardProps) {
  const isAdmin = currentUser.role === 'Admin';
  
  // States for interactive UI
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-07-21');
  const [activeTab, setActiveTab] = useState<'utilization' | 'revenue'>('utilization');
  const [tickerTime, setTickerTime] = useState<string>('');

  // Update UTC clock real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTickerTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter athlete specific reservations
  const athleteReservations = reservations.filter(
    r => r.userEmail === currentUser.email && r.status !== 'Cancelled'
  );

  // Sort upcoming reservations
  const getUpcomingReservations = () => {
    const list = isAdmin ? reservations : athleteReservations;
    return list
      .filter(r => r.status === 'Confirmed' || r.status === 'Pending')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingList = getUpcomingReservations();
  const nextReservation = upcomingList[0];

  // Calculated Stats
  const activeBookingsCount = upcomingList.length;
  const totalSpend = athleteReservations.reduce((sum, r) => sum + r.price, 0);
  const totalBookedHours = athleteReservations.filter(r => r.status === 'Completed').length * 2; // Assuming 2 hours average

  // Countdown timer for next session
  const [countdownText, setCountdownText] = useState('00h 00m 00s');
  
  useEffect(() => {
    if (!nextReservation) return;

    const timer = setInterval(() => {
      const targetStr = `${nextReservation.date}T${nextReservation.timeSlot.split(' - ')[0]}:00`;
      const targetDate = new Date(targetStr).getTime();
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setCountdownText('Session Starting Now!');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownText(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextReservation]);

  // Admin stats
  const totalSystemBookings = reservations.filter(r => r.status !== 'Cancelled').length;
  const activeFacilitiesCount = facilities.filter(f => f.status === 'Available').length;
  const maintenanceFacilitiesCount = facilities.filter(f => f.status === 'Maintenance').length;
  const totalSystemUsers = 6; // matching mock initial list

  // Calendar dates mapping for visual slider (July 20, 2026 is Monday)
  const weekdays = [
    { name: 'Mon', day: '20', dateStr: '2026-07-20' },
    { name: 'Tue', day: '21', dateStr: '2026-07-21' },
    { name: 'Wed', day: '22', dateStr: '2026-07-22' },
    { name: 'Thu', day: '23', dateStr: '2026-07-23' },
    { name: 'Fri', day: '24', dateStr: '2026-07-24' },
    { name: 'Sat', day: '25', dateStr: '2026-07-25' },
    { name: 'Sun', day: '26', dateStr: '2026-07-26' },
  ];

  // SVG chart simulation data (Utilization hours of facilities per day of week)
  const chartData = [
    { day: 'Mon', util: 14, revenue: 450 },
    { day: 'Tue', util: 22, revenue: 720 },
    { day: 'Wed', util: 18, revenue: 580 },
    { day: 'Thu', util: 26, revenue: 840 },
    { day: 'Fri', util: 32, revenue: 1100 },
    { day: 'Sat', util: 40, revenue: 1450 },
    { day: 'Sun', util: 35, revenue: 1200 },
  ];

  const maxUtilVal = 45;
  const maxRevVal = 1600;

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Stats & Weekly Calendar */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Stats Roster */}
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

            {/* Interactive Weekly Calendar Slider */}
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">Interactive Weekly Calendar</h3>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">Select a day to view scheduled performance locks.</p>
                </div>
                <button 
                  onClick={() => onNavigate('facilities')}
                  className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Book A Slot
                </button>
              </div>

              {/* Day horizontal slider */}
              <div className="grid grid-cols-7 gap-2.5 mb-6">
                {weekdays.map((day) => {
                  const isSelected = selectedCalendarDate === day.dateStr;
                  const dayBookings = athleteReservations.filter(r => r.date === day.dateStr);
                  const hasBookings = dayBookings.length > 0;

                  return (
                    <button
                      key={day.dateStr}
                      onClick={() => setSelectedCalendarDate(day.dateStr)}
                      className={`py-3.5 rounded-xl flex flex-col items-center justify-between transition-all cursor-pointer relative ${
                        isSelected 
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-103 border border-primary' 
                          : 'bg-surface-container-low hover:bg-surface-container border border-outline-variant'
                      }`}
                    >
                      <span className={`text-[10px] font-mono uppercase font-bold ${isSelected ? 'text-white/75' : 'text-outline'}`}>
                        {day.name}
                      </span>
                      <span className="font-display font-black text-lg mt-1">
                        {day.day}
                      </span>
                      {hasBookings && (
                        <span className={`absolute bottom-2.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-secondary-container' : 'bg-primary'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Day scheduled info details */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <span className="block text-[9px] font-mono text-outline uppercase font-bold tracking-widest mb-3">
                  SCHEDULED RESERVATIONS FOR {weekdays.find(w => w.dateStr === selectedCalendarDate)?.name} JULY {weekdays.find(w => w.dateStr === selectedCalendarDate)?.day}
                </span>

                {athleteReservations.filter(r => r.date === selectedCalendarDate).length === 0 ? (
                  <div className="text-center py-6">
                    <span className="text-xs text-on-surface-variant font-medium block">No sessions scheduled for this day.</span>
                    <button 
                      onClick={() => onNavigate('facilities')}
                      className="text-primary hover:text-primary-container font-semibold text-xs mt-2 underline cursor-pointer"
                    >
                      Check court availability
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {athleteReservations.filter(r => r.date === selectedCalendarDate).map((res) => (
                      <div 
                        key={res.id}
                        className="bg-white p-3.5 rounded-xl border border-outline-variant flex items-center justify-between hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={res.facilityImage} 
                            alt={res.facilityName}
                            className="w-10 h-10 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-display font-bold text-sm text-on-surface block">{res.facilityName}</span>
                            <span className="text-[11px] text-outline font-mono block mt-0.5">{res.timeSlot} | {res.sport}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-display font-bold text-sm text-primary">${res.price}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-secondary-container text-on-secondary-container">
                            {res.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Countdown card & arena suggestions */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Countdown Active Timer Card */}
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
                    <span className="text-white/60 text-xs font-mono block mt-0.5">{nextReservation.facilityName}</span>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-6 text-center">
                  <span className="block text-[10px] text-white/50 font-mono uppercase tracking-wider font-bold mb-1">Time Remaining</span>
                  <span className="block font-display font-black text-2xl tracking-widest text-secondary-container">
                    {countdownText}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50">Allocated Sport:</span>
                    <span className="font-bold text-white/90">{nextReservation.sport}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50">Time Slot Locked:</span>
                    <span className="font-bold text-white/90 font-mono text-[11px]">{nextReservation.timeSlot}</span>
                  </div>
                  {nextReservation.equipment.length > 0 && (
                    <div className="pt-2 border-t border-white/10">
                      <span className="block text-[10px] text-white/50 font-mono uppercase font-bold mb-1">Booked Equipment:</span>
                      <div className="flex flex-wrap gap-1">
                        {nextReservation.equipment.map((eq, i) => (
                          <span key={i} className="bg-white/10 text-white/80 px-2 py-0.5 rounded text-[9px] font-sans">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => onCancelReservation(nextReservation.id)}
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

            {/* Personalized Recommendations */}
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
              <span className="text-[10px] font-mono text-outline font-bold uppercase tracking-widest block mb-4">
                RECOMMENDED COURTS
              </span>

              <div className="space-y-4">
                {facilities.slice(0, 2).map((fac) => (
                  <div key={fac.id} className="flex gap-3 group cursor-pointer" onClick={() => onNavigate('facilities')}>
                    <img 
                      src={fac.image} 
                      alt={fac.name} 
                      className="w-14 h-14 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono font-bold text-primary block">{fac.type} • {fac.location}</span>
                      <span className="font-display font-bold text-xs text-on-surface block truncate group-hover:text-primary transition-colors">
                        {fac.name}
                      </span>
                      <span className="font-display font-extrabold text-xs text-on-surface-variant block mt-0.5">${fac.pricePerHour}/hr</span>
                    </div>
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
          {/* Quick Core Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
              <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Total Active Bookings</span>
              <span className="block font-display font-black text-3xl text-primary mt-1.5">{totalSystemBookings} slots</span>
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-secondary">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+14.2% since yesterday</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
              <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Arenas Operational</span>
              <span className="block font-display font-black text-3xl text-on-surface mt-1.5">{activeFacilitiesCount} / {facilities.length}</span>
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-outline">
                <span className="inline-block w-2 h-2 bg-secondary rounded-full" />
                <span>{maintenanceFacilitiesCount} in maintenance</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
              <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Registered Members</span>
              <span className="block font-display font-black text-3xl text-primary mt-1.5">{totalSystemUsers} users</span>
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-primary-container">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>2 staff accounts active</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
              <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Estimated Revenue (Jul)</span>
              <span className="block font-display font-black text-3xl text-secondary mt-1.5">$5,920.00</span>
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-secondary">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>Targeting $8k milestone</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart & Quick Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Line/Bar Custom SVG Chart */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">System Performance Analytics</h3>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">Real-time daily booking metric visualizations.</p>
                </div>

                <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant">
                  <button
                    onClick={() => setActiveTab('utilization')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      activeTab === 'utilization' ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    Usage (Hrs)
                  </button>
                  <button
                    onClick={() => setActiveTab('revenue')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      activeTab === 'revenue' ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    Revenue ($)
                  </button>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-64 w-full bg-surface-container-lowest p-4 rounded-xl border border-outline-variant relative flex items-end justify-between pt-8">
                {/* Y-Axis lines helper */}
                <div className="absolute left-4 right-4 top-1/4 border-t border-outline-variant/40" />
                <div className="absolute left-4 right-4 top-2/4 border-t border-outline-variant/40" />
                <div className="absolute left-4 right-4 top-3/4 border-t border-outline-variant/40" />

                {chartData.map((data, index) => {
                  const barVal = activeTab === 'utilization' ? data.util : data.revenue;
                  const maxVal = activeTab === 'utilization' ? maxUtilVal : maxRevVal;
                  const heightPercent = Math.min((barVal / maxVal) * 100, 100);

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group z-10 relative">
                      {/* Hover Tooltip tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] font-mono font-bold px-2 py-1 rounded shadow-md -translate-y-2 pointer-events-none">
                        {activeTab === 'utilization' ? `${data.util} hrs` : `$${data.revenue}`}
                      </div>

                      {/* Bar fill */}
                      <div className="w-8 sm:w-12 bg-surface-container-high rounded-t-lg overflow-hidden h-44 flex items-end">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            activeTab === 'utilization' ? 'bg-primary-container' : 'bg-secondary'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      <span className="text-[10px] font-mono text-outline font-bold uppercase">{data.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Facility controls */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex-1">
                <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest mb-4">
                  OPERATIONS LAUNCHER
                </span>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => onNavigate('manage-facility')}
                    className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary/40 text-left transition-all flex items-center justify-between cursor-pointer"
                    id="admin-btn-create-facility"
                  >
                    <div>
                      <span className="block font-display font-extrabold text-sm text-primary">Provision New Arena</span>
                      <span className="block text-[10px] text-outline mt-0.5">Use the 4-step creation wizard</span>
                    </div>
                    <Plus className="h-5 w-5 text-primary" />
                  </button>

                  <button
                    onClick={() => onNavigate('users')}
                    className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary/40 text-left transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="block font-display font-extrabold text-sm text-on-surface">Audit Active Members</span>
                      <span className="block text-[10px] text-outline mt-0.5">Adjust status, roles & spend metrics</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-outline" />
                  </button>

                  <button
                    onClick={() => onNavigate('reservations')}
                    className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary/40 text-left transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="block font-display font-extrabold text-sm text-on-surface">Export Reservation Log</span>
                      <span className="block text-[10px] text-outline mt-0.5">Cancel, complete or filter logs</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-outline" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pending / Confirmed system bookings */}
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
                  {reservations.slice(0, 4).map((res) => (
                    <tr key={res.id} className="hover:bg-surface-container-low/50">
                      <td className="py-3 font-mono text-[11px] text-outline">{res.id}</td>
                      <td className="py-3 font-display font-bold text-primary">{res.facilityName}</td>
                      <td className="py-3 text-on-surface">{res.userName}</td>
                      <td className="py-3 font-mono text-[11px]">{res.date} • {res.timeSlot}</td>
                      <td className="py-3 text-right font-display font-bold">${res.price}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                          res.status === 'Confirmed' 
                            ? 'bg-secondary-container text-on-secondary-container' 
                            : res.status === 'Completed' 
                            ? 'bg-primary-container text-white' 
                            : 'bg-error-container text-error'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}