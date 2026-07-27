'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '../../components/Dashboard';
import Header from '../../components/Header';
import { INITIAL_FACILITIES } from '../../mockData';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState({
    userId: '',
    name: 'Loading...',
    email: '',
    role: 'user'
  });
  const [reservations, setReservations] = useState([]);
  
  // Add state for stats
  const [stats, setStats] = useState({
    monthlyInvestment: 0,
    hoursCompleted: 0,
    confirmedSlotsCount: 0
  });

  useEffect(() => {
    async function fetchUserAndData() {
      try {
        const userRes = await fetch('/api/auth/currentUser');
        const userJson = await userRes.json();

        if (userJson.success && userJson.user) {
          const loggedUser = userJson.user;
          setCurrentUser(loggedUser);

          // Fetch reservations using the dynamic user's ID
          const resRes = await fetch(`/api/reservations?userId=${loggedUser.userId}`);
          const resJson = await resRes.json();
          
          if (resJson.success) {
            setReservations(resJson.data);
          }

          // Fetch user stats from the new stats API route
          const statsRes = await fetch(`/api/users/stats?userId=${loggedUser.userId}`);
          const statsJson = await statsRes.json();
          
          if (statsRes.ok) {
            setStats(statsJson);
          }

        } else {
          router.push('/auth');
        }
      } catch (err) {
        console.error('Failed to load dashboard session:', err);
      }
    }
    fetchUserAndData();
  }, [router]);

  const handleCancelReservation = async (id: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setReservations(prev => prev.filter((r: any) => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentUser={currentUser} />

      <main className="flex-1 overflow-y-auto">
        <Dashboard
          currentUser={currentUser as any}
          facilities={INITIAL_FACILITIES}
          reservations={reservations}
          stats={stats} 
          onNavigate={(view) => {
            router.push(`/${view}`);
          }}
          onCancelReservation={handleCancelReservation}
        />
      </main>
    </div>
  );
}