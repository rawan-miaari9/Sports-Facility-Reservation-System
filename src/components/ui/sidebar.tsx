import React from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  CalendarDays, 
  Users, 
  Settings, 
  LogOut, 
  Activity,
  Award
} from 'lucide-react';
import { AppView, User } from '@/types/admin/admin';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  currentUser: User;
  onLogout: () => void;
}

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  currentUser, 
  onLogout 
}: SidebarProps) {

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'user'] },
    { id: 'facilities', label: 'Arenas & Booking', icon: Dumbbell, roles: ['admin', 'user'] },
    { id: 'reservations', label: 'Manage Reservations', icon: CalendarDays, roles: ['admin', 'user'] },
    { id: 'users', label: 'User Management', icon: Users, roles: ['admin'] },
    { id: 'settings', label: 'Profile & Settings', icon: Settings, roles: ['admin', 'user'] }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="w-68 bg-[#0b1320] text-white flex flex-col justify-between h-screen sticky top-0 border-r border-white/5 shrink-0 z-40 shadow-xl">
      {/* Top Brand Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white p-2.5 rounded-xl shadow-md shadow-primary/20 flex items-center justify-center">
            <Activity className="h-6.5 w-6.5" />
          </div>
          <div>
            <span className="font-display font-black text-lg tracking-wider text-white uppercase">
              Athletic<span className="text-secondary-container">Hub</span>
            </span>
            <span className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">
              Elite Performance Facility
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 flex flex-col gap-1.5">
        
        {filteredNavItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'facilities' && currentView === 'manage-facility');
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as AppView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Highlight bar */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-secondary-container rounded-r" />
              )}
              
              <Icon className={`h-5 w-5 transition-colors ${
                isActive ? 'text-secondary-container' : 'text-white/40 group-hover:text-white/80'
              }`} />
              
              <span className="font-display">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom User Roster Profile Badge */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-4 bg-black/20">
        <button 
          onClick={onLogout}
          className="w-full py-2.5 px-4 bg-white/5 hover:bg-error/10 hover:text-red-400 text-white/70 border border-white/10 hover:border-error/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          id="sidebar-btn-logout"
        >
          <LogOut className="h-4 w-4" />
          Sign Out Portal
        </button>
      </div>
    </aside>
  );
}
