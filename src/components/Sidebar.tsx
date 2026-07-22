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
import { AppView, User } from '../types';

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
  
  // Choose avatar image based on user name
  const getAvatarUrl = (user: User) => {
    if (user.name.includes('Alex')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGilX0KPzTBYXfEvOObw5tILca1AxjPK7-5OaNOD4hYewqwhTEBwihZlFMU050gEil8rjRMPoPzal91e8moz5shbU4OVCnoRkQY9W4LNWK9dWk5pONUSFPiPtrSJF-cwnTGR9yt0VKe8QccvGFxgQIAyHZdpIhaSE3Wg5PVAsc1QDcCiL4ePKxdjCRzgAd5usUhyuiNgJYRJTURhFK0jQ0kzeAutJw40B_qCxVMSHLblqnBja_PeKleMNuPrzbMgiwLIVi0u-EfoE';
    }
    if (user.name.includes('Sofia')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtSsOtFUs35W6-Oe04TAzzLsYQwkYCrHOj5PMOF_GwMpx9N3HMlZUF40zNAn5XQSrndHguBv-xOB0ZsxG7tkAyNSFbQPY7RerPDR4sj8mN0Pgm4iswHQrchN3-IP8TIImi0ECcyCwlAL1VnuQPFluaYPkOSuAM437CW065C5XCFc5DzZYH3FkNgEqT75BnIV1pisUDEzxuvQ86Ox6AMdL2WbMa3DRMx1UcRtqSuNlb9l-MGF_dp0UCbyZ02A62JwajbRN20FHYU08';
    }
    if (user.name.includes('Marcus')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPBKvOQNREzCHzWVoolVUboJYHh5LbX1S9TIo_wdBxZegQdyXMwSecZdAqHMDA9JlLL1l1dpE29czbyditGbAB3-LCCmiXgiOO5N1mv0CAHDkH-QHBEolT_ERpyBahe1dgO0b3D6CZTGv2QAm5vCCPOntPNv84TguyBNMgc3hlbw-Khssy5z85PcL8d0LovM9TeLKcrKzXU65Oo6PuaWzZPTTDGENU8pqRGBoHwhq30yGNydy6LTTrk2fgH_fDhLV92-rr_DjL_Q4';
    }
    // High-quality fallback initials image
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=003f87&color=fff&size=128&bold=true`;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Athlete'] },
    { id: 'facilities', label: 'Arenas & Booking', icon: Dumbbell, roles: ['Admin', 'Athlete'] },
    { id: 'reservations', label: 'Reservations History', icon: CalendarDays, roles: ['Admin', 'Athlete'] },
    { id: 'users', label: 'User Management', icon: Users, roles: ['Admin'] },
    { id: 'settings', label: 'Profile & Settings', icon: Settings, roles: ['Admin', 'Athlete'] }
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
        <span className="px-3 text-[10px] font-mono text-white/30 uppercase tracking-wider font-bold mb-2 block">
          CORE GRID
        </span>
        
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
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={getAvatarUrl(currentUser)}
              alt={currentUser.name} 
              className="w-11 h-11 rounded-xl object-cover border border-white/10"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 bg-secondary text-white p-0.5 rounded-full border-2 border-[#0b1320]">
              <Award className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-display font-extrabold text-white truncate">
              {currentUser.name}
            </span>
            <span className="block text-[10px] font-mono text-white/50 truncate">
              {currentUser.email}
            </span>
            <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest ${
              currentUser.role === 'Admin' 
                ? 'bg-secondary-container/25 text-on-secondary-container' 
                : 'bg-primary-container/25 text-primary-container'
            }`}>
              {currentUser.role}
            </span>
          </div>
        </div>

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
