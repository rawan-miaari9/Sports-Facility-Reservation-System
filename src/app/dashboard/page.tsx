'use client';

import React from 'react';
import Dashboard from '../../components/Dashboard';
import Sidebar from '../../components/Sidebar';
import { INITIAL_FACILITIES } from '../../mockData';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={'dashboard' as any}
        onViewChange={(view) => {
          router.push(`/${view}`);
        }}
        currentUser={{ name: 'User', role: 'Athlete' } as any}
        onLogout={() => {
          router.push('/auth');
        }}
      />

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-y-auto">
        <Dashboard
          currentUser={{ name: 'User', role: 'Athlete' } as any}
          facilities={INITIAL_FACILITIES}
          reservations={[]}
          onNavigate={(view) => {
            router.push(`/${view}`);
          }}
          onCancelReservation={(id) => {
            console.log('Cancel reservation', id);
          }}
        />
      </main>
    </div>
  );
}