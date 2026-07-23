import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  Users, 
  Clock, 
  ChevronRight, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Facility } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  facilities: Facility[];
  onSelectFacility: (facility: Facility) => void;
}

export default function LandingPage({ 
  onGetStarted, 
  onLoginClick, 
  facilities,
  onSelectFacility 
}: LandingPageProps) {
  const [selectedSport, setSelectedSport] = useState('All');
  const [searchDate, setSearchDate] = useState('');

  const featuredFacilities = facilities.slice(0, 3);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary-container selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-outline-variant px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2.5 rounded-xl shadow-md shadow-primary/20 flex items-center justify-center">
              <Activity className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-wider text-primary uppercase">
                Athletic<span className="text-primary-container">Hub</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-outline uppercase font-bold">
                Elite Performance Facility
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#facilities" className="font-medium text-sm text-on-surface-variant hover:text-primary transition-colors">
              Facilities
            </a>
            <a href="#why-us" className="font-medium text-sm text-on-surface-variant hover:text-primary transition-colors">
              Core Pillars
            </a>
            <a href="#metrics" className="font-medium text-sm text-on-surface-variant hover:text-primary transition-colors">
              Live Stats
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="px-5 py-2 text-sm font-semibold text-primary hover:text-primary-container transition-colors rounded-xl hover:bg-surface-container"
              id="landing-btn-login"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-container rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              id="landing-btn-register"
            >
              Book Premium Slot
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-low via-background to-surface-container-low -z-10" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Text */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Dynamic Booking Engine Live
            </div>
            
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#0b1320] leading-[1.1] tracking-tight">
              Access & Book <br />
              <span className="text-primary relative">
                Elite Performance
                <span className="absolute bottom-1.5 left-0 w-full h-2 bg-secondary-container -z-10 rounded" />
              </span> <br />
              Facilities On-Demand
            </h1>

            <p className="text-on-surface-variant text-base sm:text-lg max-w-xl leading-relaxed">
              Ditch the coordination chaos. AthleticHub streamlines championship-grade hardwood courts, red clay tennis arenas, heated Olympic swimming lanes, and panoramic glass padel stadiums for athletes and team operations.
            </p>

            {/* Quick search panel */}
            <div className="w-full max-w-2xl bg-white p-4 rounded-2xl shadow-xl shadow-surface-container-high/40 border border-outline-variant flex flex-col md:flex-row gap-4 items-stretch md:items-center mt-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-outline font-bold">Select Sport</label>
                <select 
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full bg-transparent font-medium text-sm text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="All">All Sports</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Padel">Padel</option>
                  <option value="Aquatics">Aquatics</option>
                </select>
              </div>

              <div className="w-px h-10 bg-outline-variant hidden md:block" />

              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-outline font-bold">Booking Date</label>
                <input 
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-transparent font-medium text-sm text-on-surface focus:outline-none cursor-pointer"
                />
              </div>

              <button 
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary-container text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/20"
                id="landing-search-submit"
              >
                Search Available
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-6 mt-2 font-mono text-xs text-outline">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-secondary" /> Inspected Facilities
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-secondary" /> Real-Time Reservations
              </div>
            </div>
          </div>

          {/* Hero Image / Badge */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-3 scale-102 -z-10" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] group">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwRAqA54Xj8BLBMGU1Nid7Fhm7SckGPhkqcIt6GqJZwzRd6UfFJOQvlumVpLJxQ74R6Y2g9ndw47dX4v-UNz8CYOPpNySDEJTRW-nEgJKqcUeI2QzyRMdYJSE-8AynqCtZY6Ty1E0b29p1h6Z7PnY4wsEFNjGtCoXpTbWkTejXSAtoTTSMVnSUUr3Q8C0An2cebDoq1jxOGdtmkYA6zG_ZHJjxapzg5hpcz4qFGadSD3sZH8sM9XqadrmAuxIeue_XukyQeBMjnug" 
                alt="Elite athlete sprinting in modern athletic facility"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white p-4 glass-card border border-white/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary p-1.5 rounded-lg text-white">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">Championship Standards</h4>
                    <p className="text-white/80 text-[11px] font-sans">Every venue certified for competitive dimensions and safety surfaces.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Float Badge */}
            <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-outline-variant flex items-center gap-3 animate-bounce-subtle">
              <div className="bg-secondary-container p-2 rounded-xl text-on-secondary-container">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <span className="block font-display font-extrabold text-lg text-primary">98.4%</span>
                <span className="block text-[10px] font-mono text-outline font-bold uppercase">Optimal Surface Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section id="metrics" className="py-12 bg-white border-y border-outline-variant px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="block font-display font-black text-3xl sm:text-4xl text-primary">150k+</span>
              <span className="block text-xs font-mono text-outline font-bold uppercase mt-1">Booked Athletic Hours</span>
            </div>
            <div>
              <span className="block font-display font-black text-3xl sm:text-4xl text-primary">24/7</span>
              <span className="block text-xs font-mono text-outline font-bold uppercase mt-1">Automated Grid Control</span>
            </div>
            <div>
              <span className="block font-display font-black text-3xl sm:text-4xl text-primary">5 Elite</span>
              <span className="block text-xs font-mono text-outline font-bold uppercase mt-1">Certified Venues</span>
            </div>
            <div>
              <span className="block font-display font-black text-3xl sm:text-4xl text-primary">&lt; 1 min</span>
              <span className="block text-xs font-mono text-outline font-bold uppercase mt-1">Confirmation Latency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section id="facilities" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest">Selected Arena Profiles</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-on-surface">
              Featured Arenas & Courts
            </h2>
          </div>
          <button 
            onClick={onGetStarted}
            className="group font-display font-bold text-sm text-primary hover:text-primary-container transition-colors flex items-center gap-1 cursor-pointer"
          >
            Explore all certified arenas
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredFacilities.map((facility) => (
            <div 
              key={facility.id}
              className="bg-white rounded-2xl overflow-hidden border border-outline-variant hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img 
                  src={facility.image} 
                  alt={facility.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-bold text-primary shadow-sm border border-outline-variant">
                  {facility.type}
                </div>
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-mono font-bold shadow-sm ${
                  facility.status === 'Available' 
                    ? 'bg-secondary-container text-on-secondary-container' 
                    : facility.status === 'Booked' 
                    ? 'bg-primary-container text-white' 
                    : 'bg-outline-variant text-[#424752]'
                }`}>
                  {facility.status}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs text-outline mb-1.5 font-mono">
                    <MapPin className="h-3.5 w-3.5" />
                    {facility.location}
                  </div>
                  <h3 className="font-display font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                    {facility.name}
                  </h3>
                  <p className="text-on-surface-variant text-xs mt-2 line-clamp-2 leading-relaxed">
                    {facility.description}
                  </p>
                </div>

                <div className="border-t border-outline-variant mt-6 pt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-outline">Rate per hour</span>
                    <span className="font-display font-extrabold text-xl text-primary">
                      ${facility.pricePerHour}
                      <span className="text-xs font-normal text-outline"> / hr</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      onGetStarted();
                      onSelectFacility(facility);
                    }}
                    className="bg-surface-container hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold text-primary transition-all cursor-pointer"
                  >
                    View & Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us / Pillars */}
      <section id="why-us" className="py-24 bg-surface-container-low border-t border-outline-variant px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest">Built For Peak Athletics</span>
            <h2 className="font-display font-black text-3xl text-on-surface mt-2">
              Championship Operations Pillars
            </h2>
            <p className="text-on-surface-variant text-sm mt-3 leading-relaxed">
              Every facility, schedule lock-in, and equipment allocation is precision-engineered for athletes who demand seamless performance access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-4">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface">Integrated Equipment Hiring</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Add certified balls, pinnies, training cones, and match racquets in one-click directly inside your booking workflow. Pick them up at the front desk.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-4">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface">Collaborative Team Booking</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Our facilities dynamically support up to 22 players with specialized athlete roster permissions and dedicated administrator dashboards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-4">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface">Automatic Timeline Lock</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Real-time booking schedule guarantees zero overlap conflicts. Once your slot is locked, our server guarantees the arena is yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b1320] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-12">
          <div className="flex items-center gap-3">
            <div className="bg-primary-container text-white p-2.5 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-wider uppercase text-white">
                Athletic<span className="text-secondary-container">Hub</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">
                Elite Performance Facility
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm text-white/70">
            <a href="#facilities" className="hover:text-white transition-colors">Arenas</a>
            <a href="#why-us" className="hover:text-white transition-colors">Pillars</a>
            <a href="#metrics" className="hover:text-white transition-colors">Stats</a>
          </div>

          <button 
            onClick={onGetStarted}
            className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            Start Performance Booking
          </button>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 mt-8 gap-4 font-mono">
          <span>&copy; 2026 AthleticHub Inc. All rights reserved.</span>
          <span>Certified Standard Courts | Kinetic Grid Design System v4.1</span>
        </div>
      </footer>
    </div>
  );
}
