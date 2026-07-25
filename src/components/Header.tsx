'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Calendar, Settings, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentUser: {
    name: string;
    email: string;
    role: string;
  };
}

export default function Header({ currentUser }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-slate-900 text-white px-8 py-4 flex items-center justify-between border-b border-slate-800">
      {/* Brand Logo / Title - Acts as Home/Dashboard link */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-md">
          A
        </div>
        <div>
          <span className="font-extrabold tracking-wider text-lg">ATHLETIC<span className="text-emerald-400">HUB</span></span>
          <p className="text-xs text-slate-400 tracking-wide">ELITE PERFORMANCE FACILITY</p>
        </div>
      </div>

      {/* Top Right Profile Menu Trigger */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-2xl hover:bg-slate-800 transition border border-slate-800 hover:border-slate-700"
        >
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-white">{currentUser?.name || 'Rawan'}</p>
            <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider">
              {currentUser?.role || 'Athlete'}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu Modal */}
        {isOpen && (
          <div className="absolute right-0 top-14 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3 z-50 text-slate-200">
            {/* User Info Header */}
            <div className="px-5 py-3 border-b border-slate-800">
              <p className="font-semibold text-sm text-white">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
            </div>

            {/* Navigation Options (Dashboard removed, router paths aligned) */}
            <div className="py-2 px-2 space-y-1">
              <button 
                onClick={() => { setIsOpen(false); router.push('/facilities/Booking'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-800 transition text-slate-300 hover:text-white"
              >
                <Dumbbell className="w-4 h-4 text-blue-400" />
                <span>Arenas & Booking</span>
              </button>
              <button 
                onClick={() => { setIsOpen(false); router.push('/reservations'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-800 transition text-slate-300 hover:text-white"
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Reservations History</span>
              </button>
              <button 
                onClick={() => { setIsOpen(false); router.push('/UserSettings'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-800 transition text-slate-300 hover:text-white"
              >
                <Settings className="w-4 h-4 text-blue-400" />
                <span>Profile & Settings</span>
              </button>
            </div>

            {/* Sign Out Section */}
            <div className="border-t border-slate-800 pt-2 px-2 mt-1">
              <button 
                onClick={() => { setIsOpen(false); router.push('/auth'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-red-500/10 text-red-400 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Portal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}