import React, { useEffect } from 'react';
import { User } from '../../types/admin/admin';
import ProfileDetailsForm from './ProfileDetailsForm';
import PasswordChangeForm from './PasswordChangeForm';
import UserCard from './UserCard';

interface SettingsViewProps {
  currentUser: User & {
    phone?: string;
    phoneNumber?: string;
    mobile?: string;
    dateOfBirth?: string | Date;
    dob?: string | Date;
    birthDate?: string | Date;
  };
  onUpdateProfile: (updated: User) => void;
}

export default function SettingsView({ currentUser, onUpdateProfile }: SettingsViewProps) {
  const userId = currentUser._id || currentUser.id;

  useEffect(() => {
    async function fetchFreshUserData() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const freshUser = await res.json();
          onUpdateProfile(freshUser);
        }
      } catch (err) {
        console.error('Failed to fetch fresh user data:', err);
      }
    }

    fetchFreshUserData();
  }, [userId]);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar bg-background">
      <header>
        <h1 className="font-display font-black text-2xl text-on-surface">
          Profile & Settings Control
        </h1>
        <p className="text-on-surface-variant text-xs mt-0.5">
          Manage your credentials, update contact records, and sync security preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <ProfileDetailsForm
            currentUser={currentUser}
            userId={userId}
            onUpdateProfile={onUpdateProfile}
          />

          <PasswordChangeForm userId={userId} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <UserCard currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}