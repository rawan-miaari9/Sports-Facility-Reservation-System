import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MapPin, 
  Users, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Compass, 
  Sparkles, 
  ArrowRight,
  Zap
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
  const [currentSlide, setCurrentSlide] = useState(0);

  // Verified, reliable sports image URLs without swimming, using direct static Unsplash assets
  const heroSlides = [
    {
      id: 'slide-1',
      name: 'Championship Hardwood Arena',
      type: 'Basketball',
      location: 'Main Stadium Complex',
      pricePerHour: 120,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600&auto=format&fit=crop&q=80',
      tag: 'NBA-Standard Maple Flooring'
    },
   {
      id: 'slide-2',
      name: 'Panoramic Glass Padel Arena',
      type: 'Padel',
      location: 'Rooftop Sports Deck',
      pricePerHour: 110,
      image: '/padel-court.png',
      tag: 'Tempered Glass & Turf'
    },
    {
      id: 'slide-3',
      name: 'Panoramic Glass Padel Arena',
      type: 'Padel',
      location: 'Rooftop Sports Deck',
      pricePerHour: 110,
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1600&auto=format&fit=crop&q=80',
      tag: 'Tempered Glass & Turf'
    },
    {
      id: 'slide-4',
      name: 'Professional FIFA Turf Pitch',
      type: 'Soccer',
      location: 'Suburban Athletic Ground',
      pricePerHour: 140,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&auto=format&fit=crop&q=80',
      tag: 'All-Weather Hybrid Grass'
    }
  ];

  // Robust auto-advance timer for smooth carousel sliding
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary-container selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-outline-variant px-6 py-3 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-xl shadow-md shadow-primary/20 flex items-center justify-center">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-wider text-primary uppercase">
                Athletic<span className="text-primary-container">Hub</span>
              </span>
              <span className="block text-[8px] font-mono tracking-widest text-outline uppercase font-bold">
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
              className="px-4 py-2 text-sm font-semibold text-primary hover:text-primary-container transition-colors rounded-xl hover:bg-surface-container cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-container rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
            >
              Book Premium Slot
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Full Screen Viewport with Carousel at the Center */}
      <section className="relative w-full h-[calc(100vh-73px)] min-h-[620px] overflow-hidden bg-slate-950 flex flex-col justify-between">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.name}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
          </div>
        ))}

        {/* Top Header/Title Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto w-full pt-6 md:pt-8 px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider shadow-lg">
            <Sparkles className="h-4 w-4 text-secondary" />
            Dynamic Booking Engine Live
          </div>
          
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight mt-3 max-w-4xl drop-shadow-md">
            Access & Book <span className="text-secondary ">Elite Performance</span> Facilities
          </h1>
        </div>

        {/* Bottom Carousel Card & Search Panel */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 pb-8 md:pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            
            {/* Active Slide Info Box */}
            <div className="text-white flex flex-col gap-2 max-w-2xl bg-black/50 backdrop-blur-xl p-6 rounded-3xl border border-white/15 shadow-2xl">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-secondary text-white text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {heroSlides[currentSlide].type}
                </span>
                <span className="text-xs font-mono text-white/90 flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                  <MapPin className="h-3.5 w-3.5 text-secondary" /> {heroSlides[currentSlide].location}
                </span>
                <span className="text-xs font-mono text-secondary-container flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                  <Zap className="h-3.5 w-3.5 text-secondary" /> {heroSlides[currentSlide].tag}
                </span>
              </div>
              
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                {heroSlides[currentSlide].name}
              </h3>
              
              <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-white/70">Hourly Rate</span>
                  <span className="font-display font-black text-2xl text-white">
                    ${heroSlides[currentSlide].pricePerHour}
                    <span className="text-xs font-normal text-white/70"> / hr</span>
                  </span>
                </div>
                <button 
                  onClick={() => {
                    onGetStarted();
                    const matchedFacility = facilities.find(f => f.type === heroSlides[currentSlide].type) || facilities[0];
                    if (matchedFacility) onSelectFacility(matchedFacility);
                  }}
                  className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-xl flex items-center gap-2"
                >
                  Book Arena Now
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Search Panel */}
            <div className="bg-white/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/20 flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
              <div className="w-full sm:w-40 flex flex-col gap-1 px-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-outline font-bold text-left">Sport</label>
                <select 
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full bg-surface-container-low p-2 rounded-xl font-medium text-xs text-on-surface focus:outline-none cursor-pointer border border-outline-variant"
                >
                  <option value="All">All Sports</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Padel">Padel</option>
                </select>
              </div>

              <div className="w-full sm:w-40 flex flex-col gap-1 px-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-outline font-bold text-left">Date</label>
                <input 
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-surface-container-low p-2 rounded-xl font-medium text-xs text-on-surface focus:outline-none cursor-pointer border border-outline-variant"
                />
              </div>

              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/25 mt-auto"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-3.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-110 hidden sm:flex items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-3.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-110 hidden sm:flex items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-6 z-30 hidden md:flex gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? 'w-10 bg-secondary' : 'w-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
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
          {facilities.slice(0, 3).map((facility) => (
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