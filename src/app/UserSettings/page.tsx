'use client';

import React, { useState, useEffect } from 'react';
import UserSettingsView from '../../components/UserSettingsView';
import Header from '../../components/Header'; 
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState({
    userId: '',
    name: 'Loading...',
    email: '',
    role: 'Athlete'
  });

  useEffect(() => {
    async function fetchUserSession() {
      try {
        const userRes = await fetch('/api/auth/currentUser');
        const userJson = await userRes.json();

        if (userJson.success && userJson.user) {
          setCurrentUser(userJson.user);
        } else {
          router.push('/auth');
        }
      } catch (err) {
        console.error('Failed to load settings session:', err);
      }
    }
    fetchUserSession();
  }, [router]);

  const handleUpdateProfile = async (updatedData: any) => {
    // Optional: Add API call to update user profile if implemented by your team
    console.log('Update profile data:', updatedData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentUser={currentUser} />

      <main className="flex-1 overflow-y-auto">
        <UserSettingsView
          currentUser={currentUser as any}
          onUpdateProfile={handleUpdateProfile}
        />
      </main>
    </div>
  );
}