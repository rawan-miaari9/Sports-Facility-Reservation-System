import React from 'react';
import { User } from '../../types/admin/admin';

interface UserCardProps {
  currentUser: User;
}

export default function UserCard({ currentUser }: UserCardProps) {
  const name = currentUser?.name || '';
  const email = currentUser?.email || '';

  const initials = name
    ? name.split(' ').map((n: string) => n.charAt(0)).join('')
    : 'U';

  const memberSinceFormatted = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm text-center space-y-4">
      <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest">
        MEMBERSHIP METRIC CARD
      </span>

      <div className="w-16 h-16 rounded-2xl bg-primary text-white font-display font-black text-xl flex items-center justify-center border shadow-md mx-auto">
        {initials}
      </div>

      <div>
        <span className="block font-display font-black text-base text-on-surface">{name}</span>
        <span className="block text-xs text-outline font-mono mt-0.5">{email}</span>
      </div>

      <div className="pt-4 border-t border-outline-variant/60 grid grid-cols-2 text-center text-xs gap-4 font-mono">
        <div>
          <span className="block text-[9px] text-outline uppercase font-bold">Roster Role</span>
          <span className="font-bold text-primary block mt-0.5 capitalize">{currentUser?.role || 'user'}</span>
        </div>
        <div>
          <span className="block text-[9px] text-outline uppercase font-bold">Member Since</span>
          <span className="font-bold text-on-surface block mt-0.5">{memberSinceFormatted}</span>
        </div>
      </div>
    </div>
  );
}