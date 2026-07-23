import React, { useState } from 'react';
import { 
  Search, 
  UserCheck, 
  UserX, 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  X,
  Info,
  CheckCircle2
} from 'lucide-react';
import { User } from '../types';

interface UserManagementViewProps {
  users: User[];
  onUpdateUserRole: (id: string, newRole: 'Admin' | 'Athlete') => void;
  onUpdateUserStatus: (id: string, newStatus: 'Available' | 'Booked' | 'Suspended') => void;
  onAddNewUser: (newUser: User) => void;
}

export default function UserManagementView({
  users,
  onUpdateUserRole,
  onUpdateUserStatus,
  onAddNewUser
}: UserManagementViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // New User Drawer/Form States
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newRole, setNewRole] = useState<'Athlete' | 'Admin'>('Athlete');

  // Filter users
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalUsersCount = users.length;
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const athleteCount = users.filter(u => u.role === 'Athlete').length;
  const suspendedCount = users.filter(u => u.status === 'Suspended').length;

  // Submit on-the-fly add user
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      alert('Name and Email are required.');
      return;
    }

    const createdUser: User = {
      id: `usr-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || '+1 (555) 000-0000',
      dateOfBirth: newDob || '1995-01-01',
      memberSince: 'Jul 2026',
      bookingsCount: 0,
      status: 'Available',
      role: newRole
    };

    onAddNewUser(createdUser);
    setIsAddFormOpen(false);

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewDob('');
    setNewRole('Athlete');
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar bg-background">
      {/* Title */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-black text-2xl text-on-surface">
            Athletic Roster Management
          </h1>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Audit system credentials, toggle athlete/operator privileges, and enforce suspended locks.
          </p>
        </div>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Member Profile
        </button>
      </header>

      {/* Summary Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm text-center">
          <span className="block text-[9px] font-mono text-outline uppercase font-bold tracking-widest">Total Roster Profiles</span>
          <span className="block font-display font-black text-2xl text-primary mt-1">{totalUsersCount} Members</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm text-center">
          <span className="block text-[9px] font-mono text-outline uppercase font-bold tracking-widest">Athletes On-grid</span>
          <span className="block font-display font-black text-2xl text-[#006e25] mt-1">{athleteCount} Registered</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm text-center">
          <span className="block text-[9px] font-mono text-outline uppercase font-bold tracking-widest">Facility Operators</span>
          <span className="block font-display font-black text-2xl text-primary-container mt-1">{adminCount} Admins</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm text-center">
          <span className="block text-[9px] font-mono text-outline uppercase font-bold tracking-widest">Suspended Accounts</span>
          <span className="block font-display font-black text-2xl text-error mt-1">{suspendedCount} Locked</span>
        </div>
      </div>

      {/* Control Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-outline" />
          <input
            type="text"
            placeholder="Search roster by email, name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
          />
        </div>
        <span className="text-xs font-mono text-outline font-semibold">DATABASE STABLE</span>
      </div>

      {/* User List Table */}
      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Info className="h-10 w-10 text-outline mx-auto mb-3" />
            <span className="font-display font-bold text-base text-on-surface block">No Members Found</span>
            <span className="text-xs text-on-surface-variant max-w-sm mx-auto block mt-1">
              Adjust search strings to find registered athlete details.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low/50 text-[10px] font-mono text-outline uppercase tracking-wider">
                  <th className="py-4 px-6 font-bold">Roster Member</th>
                  <th className="py-4 px-6 font-bold">Phone Details</th>
                  <th className="py-4 px-6 font-bold">Birth Date</th>
                  <th className="py-4 px-6 font-bold text-center">Privileges (Role)</th>
                  <th className="py-4 px-6 font-bold text-center">Spend Hours Count</th>
                  <th className="py-4 px-6 font-bold text-center">Status</th>
                  <th className="py-4 px-6 font-bold text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-xs font-medium">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low/30 transition-colors">
                    {/* Name/Email */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-display font-black text-xs flex items-center justify-center border border-primary/20">
                          {user.name.split(' ').map(n => n.charAt(0)).join('')}
                        </div>
                        <div>
                          <span className="font-display font-bold text-on-surface block">{user.name}</span>
                          <span className="text-[10px] font-mono text-outline block mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6 font-mono text-[11px] text-outline">
                      {user.phone}
                    </td>

                    {/* Birthdate */}
                    <td className="py-4 px-6 text-on-surface-variant">
                      {user.dateOfBirth}
                    </td>

                    {/* Role toggler */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => onUpdateUserRole(user.id, user.role === 'Admin' ? 'Athlete' : 'Admin')}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-all border uppercase ${
                          user.role === 'Admin' 
                            ? 'bg-secondary-container/25 border-secondary/25 text-on-secondary-container' 
                            : 'bg-primary-container/25 border-primary/25 text-primary'
                        }`}
                        title="Click to toggle privileges"
                      >
                        {user.role}
                      </button>
                    </td>

                    {/* Booking counts */}
                    <td className="py-4 px-6 text-center font-display font-extrabold text-primary">
                      {user.bookingsCount} slots
                    </td>

                    {/* Status indicator */}
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        user.status === 'Available' 
                          ? 'bg-secondary-container text-on-secondary-container' 
                          : user.status === 'Booked' 
                          ? 'bg-primary-container text-white' 
                          : 'bg-error-container text-error'
                      }`}>
                        {user.status}
                      </span>
                    </td>

                    {/* Access Controls */}
                    <td className="py-4 px-6 text-right">
                      {user.status === 'Suspended' ? (
                        <button
                          onClick={() => onUpdateUserStatus(user.id, 'Available')}
                          className="bg-secondary-container hover:bg-secondary hover:text-white text-on-secondary-container px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <UserCheck className="h-4 w-4" /> Revoke Lock
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateUserStatus(user.id, 'Suspended')}
                          className="bg-error-container hover:bg-error hover:text-white text-error px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <UserX className="h-4 w-4" /> Suspended Lock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New User Drawer Overlay */}
      {isAddFormOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="flex-1" onClick={() => setIsAddFormOpen(false)} />
          <form 
            onSubmit={handleAddUserSubmit}
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-outline-variant relative z-10 animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary text-white p-2 rounded-lg">
                  <UserCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-sm text-on-surface">ADD MEMBER PROFILE</h2>
                  <span className="block text-[10px] text-outline font-mono font-bold tracking-wider uppercase">ATHLETICHUB MEMBER WORKFLOW</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddFormOpen(false)}
                className="p-1.5 hover:bg-surface-container rounded-lg text-outline hover:text-on-surface transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable inputs */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Jenkins"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sarah.jenkins@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 014-4829"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Date of Birth</label>
                <input
                  type="date"
                  value={newDob}
                  onChange={(e) => setNewDob(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Role Assignment</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewRole('Athlete')}
                    className={`py-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                      newRole === 'Athlete' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-outline-variant hover:border-outline text-on-surface-variant'
                    }`}
                  >
                    Athlete Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('Admin')}
                    className={`py-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                      newRole === 'Admin' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-outline-variant hover:border-outline text-on-surface-variant'
                    }`}
                  >
                    Facility Staff
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-outline-variant bg-surface-container-low flex gap-3">
              <button
                type="button"
                onClick={() => setIsAddFormOpen(false)}
                className="flex-1 py-3 bg-white hover:bg-surface-container border border-outline-variant rounded-xl text-xs font-bold text-on-surface-variant cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/10 cursor-pointer transition-all"
              >
                Secure Account Roster
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
