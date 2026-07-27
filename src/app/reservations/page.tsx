'use client';

import React, { useState, useEffect } from 'react';
import ReservationsView from '@/components/ReservationsView';
import Header from '../../components/Header'; 
import { useRouter } from 'next/navigation';

export default function ReservationsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState({
    userId: '',
    name: 'Loading...',
    email: '',
    role: 'Athlete'
  });
  const [reservations, setReservations] = useState([]);

useEffect(() => {
    async function fetchUserAndReservations() {
      try {
        const userRes = await fetch('/api/auth/currentUser');
        const userJson = await userRes.json();

        if (userJson.success && userJson.user) {
          const loggedUser = userJson.user;
          setCurrentUser(loggedUser);

          const res = await fetch(`/api/reservations?userId=${loggedUser.userId}`);
          const json = await res.json();
          
          // 👀 ADD THIS LINE TO INSPECT YOUR DB OBJECTS IN THE BROWSER CONSOLE:
          console.log("Reservations fetched from DB:", json.data);

          if (json.success) {
            setReservations(json.data);
          }
        } else {
          router.push('/auth');
        }
      } catch (err) {
        console.error('Failed to fetch reservations session:', err);
      }
    }
    fetchUserAndReservations();
  }, [router]);

  const handleCancelReservation = async (id: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setReservations(prev => prev.filter((r: any) => r.id !== id && r._id !== id));
      }
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
    }
  };

  const handleCompleteReservation = async (id: string) => {
    console.log('Complete reservation', id);
  };

  const handleDeleteReservation = async (id: string) => {
    handleCancelReservation(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header with Profile Dropdown Menu */}
      <Header currentUser={currentUser} />

      {/* Main Reservations Content View */}
      <main className="flex-1 overflow-y-auto">
        <ReservationsView
          reservations={reservations}
          currentUser={currentUser as any}
          onCancelReservation={handleCancelReservation}
          onCompleteReservation={handleCompleteReservation}
          onDeleteReservation={handleDeleteReservation}
        />
      </main>
    </div>
  );
}