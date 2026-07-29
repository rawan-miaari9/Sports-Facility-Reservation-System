'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, LayoutDashboard, Dumbbell, Calendar, Settings, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentUser?: {
    name: string;
    email: string;
    role: string;
  } | null;
  onLoginClick?: () => void;
  hideAuthWhenLoggedIn?: boolean; // <-- Added optional prop
}

export default function Header({ currentUser, onLoginClick, hideAuthWhenLoggedIn }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
          <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="font-display font-black text-lg tracking-wider text-blue-900 uppercase">
              Athletic<span className="text-emerald-600">Hub</span>
            </span>
            <span className="block text-[8px] font-mono tracking-widest text-slate-500 uppercase font-bold">
              Elite Performance Facility
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#facilities" className="font-medium text-sm text-slate-700 hover:text-blue-600 transition-colors">
            Facilities
          </a>
          <a href="#why-us" className="font-medium text-sm text-slate-700 hover:text-blue-600 transition-colors">
            Core Pillars
          </a>
          <a href="#metrics" className="font-medium text-sm text-slate-700 hover:text-blue-600 transition-colors">
            Live Stats
          </a>
        </nav>

        {/* Right Action: Profile Dropdown OR Sign In Button */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            !hideAuthWhenLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-2xl hover:bg-slate-100 transition border border-slate-200 cursor-pointer bg-white shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    {currentUser?.name ? currentUser.name.charAt(0) : 'R'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold leading-tight text-slate-800">{currentUser?.name || 'Rawan'}</p>
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">
                      {currentUser?.role || 'Athlete'}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-0 top-14 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-50 text-slate-700">
                    <div className="px-5 py-3 border-b border-slate-100">
                      <p className="font-semibold text-sm text-slate-900">{currentUser?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                    </div>

                    <div className="py-2 px-2 space-y-1">
                      <button 
                        onClick={() => { setIsOpen(false); router.push('/dashboard'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-100 transition text-slate-700 font-medium cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Dashboard Home</span>
                      </button>
                      <button 
                        onClick={() => { setIsOpen(false); router.push('/facilities'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-100 transition text-slate-700 font-medium cursor-pointer"
                      >
                        <Dumbbell className="w-4 h-4 text-blue-600" />
                        <span>Arenas & Booking</span>
                      </button>
                      <button 
                        onClick={() => { setIsOpen(false); router.push('/reservations'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-100 transition text-slate-700 font-medium cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Reservations History</span>
                      </button>
                      <button 
                        onClick={() => { setIsOpen(false); router.push('/UserSettings'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-100 transition text-slate-700 font-medium cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-blue-600" />
                        <span>Profile & Settings</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-2 px-2 mt-1">
                      <button 
                        onClick={() => { setIsOpen(false); router.push('/auth'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-red-50 text-red-600 font-medium transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out Portal</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null
          ) : (
            <button 
              onClick={onLoginClick || (() => router.push('/auth'))}
              className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}