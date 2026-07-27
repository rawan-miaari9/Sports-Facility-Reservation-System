import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  Bell, 
  ShieldCheck, 
  Save, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  Lock,
  Eye,
  Settings,
  HelpCircle
} from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  currentUser: User;
  onUpdateProfile: (updated: User) => void;
}

export default function SettingsView({ currentUser, onUpdateProfile }: SettingsViewProps) {
  // Local profile states (fallback to empty string if loading)
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [dob, setDob] = useState(currentUser?.dateOfBirth || '');
  
  // Keep local state synchronized when currentUser loads or changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setDob(currentUser.dateOfBirth || '');
    }
  }, [currentUser]);

  // Local toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(true);
  const [calendarSync, setCalendarSync] = useState(false);
  const [doubleLock, setDoubleLock] = useState(true);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          dateOfBirth: dob
        })
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser: User = {
          ...currentUser,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          dateOfBirth: data.user.dateOfBirth || ''
        };

        onUpdateProfile(updatedUser);
        setSaveSuccess(true);
        
        setTimeout(() => {
          setSaveSuccess(false);
        }, 2500);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('An error occurred while saving profile settings.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar bg-background">
      {/* Title */}
      <header>
        <h1 className="font-display font-black text-2xl text-on-surface">
          Profile & Settings Control
        </h1>
        <p className="text-on-surface-variant text-xs mt-0.5">
          Manage your elite credentials, activate automated timetable triggers, and customize dashboard feeds.
        </p>
      </header>

      {/* Grid Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details */}
        <form onSubmit={handleProfileSave} className="lg:col-span-8 space-y-6">
          {/* Personal Details */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm space-y-5">
            <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant/60 pb-3">
              ATHLETE ROSTER DETAILS
            </span>

            {saveSuccess && (
              <div className="p-3.5 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold flex items-center gap-2 border border-secondary/20">
                <CheckCircle2 className="h-4.5 w-4.5" />
                Profile details synchronized successfully with database grid!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary-container text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer mt-4"
              id="settings-btn-save-profile"
            >
              <Save className="h-4.5 w-4.5" />
              Save Profile Details
            </button>
          </div>

        </form>

        {/* Right Column: Profile Summary brief */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm text-center space-y-4">
            <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest">
              MEMBERSHIP METRIC CARD
            </span>

            <div className="w-16 h-16 rounded-2xl bg-primary text-white font-display font-black text-xl flex items-center justify-center border shadow-md mx-auto">
              {name ? name.split(' ').map(n => n.charAt(0)).join('') : 'U'}
            </div>

            <div>
              <span className="block font-display font-black text-base text-on-surface">{name || 'Loading...'}</span>
              <span className="block text-xs text-outline font-mono mt-0.5">{email || 'Loading...'}</span>
            </div>

            <div className="pt-4 border-t border-outline-variant/60 grid grid-cols-2 text-center text-xs gap-4 font-mono">
              <div>
                <span className="block text-[9px] text-outline uppercase font-bold">Roster Role</span>
                <span className="font-bold text-primary block mt-0.5">{currentUser?.role}</span>
              </div>
              <div>
                <span className="block text-[9px] text-outline uppercase font-bold">Member Since</span>
                <span className="font-bold text-on-surface block mt-0.5">{currentUser?.memberSince || 'July 2026'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
            <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest">
              HELP & COMPLIANCE STABLE
            </span>
            <div className="space-y-3 text-xs leading-relaxed text-on-surface-variant font-medium">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-[#006e25] shrink-0 mt-0.5" />
                <span>All facilities correspond to physical specifications inspected and approved by Athletic Operations.</span>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}