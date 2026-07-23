'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '../../components/Dashboard';
import Header from '../../components/Header';
import { INITIAL_FACILITIES } from '../../mockData';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);

  // Fetch reservations from the database API on load
  useEffect(() => {
    async function loadReservations() {
      try {
        const res = await fetch('/api/reservations?userId=6a60df19c3d0da26c5506d8');
        const json = await res.json();
        if (json.success) {
          setReservations(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch reservations:', err);
      }
    }
    loadReservations();
  }, []);

  const handleCancelReservation = async (id: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        // Update local state to remove the cancelled reservation instantly
        setReservations(prev => prev.filter((r: any) => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
    }
  };

  const currentUserObj = { 
    userId: '6a60df19c3d0da26c5506d8', 
    name: 'Rawan', 
    email: 'rawan@athletichub.com',
    role: 'Athlete' 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header with Profile Dropdown Menu */}
      <Header currentUser={currentUserObj} />

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-y-auto">
        <Dashboard
          currentUser={currentUserObj as any}
          facilities={INITIAL_FACILITIES}
          reservations={reservations}
          onNavigate={(view) => {
            router.push(`/${view}`);
          }}
          onCancelReservation={handleCancelReservation}
        />
      </main>
    </div>
  );
}