'use client';

import React, { useState, useEffect } from 'react';
import ReservationsView from '../../components/ReservationsView';
import Header from '../../components/Header'; // Import your top header component
import { useRouter } from 'next/navigation';

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);

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
        setReservations(prev => prev.filter((r: any) => r.id !== id));
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

      {/* Main Reservations Content View */}
      <main className="flex-1 overflow-y-auto">
        <ReservationsView
          reservations={reservations}
          currentUser={currentUserObj as any}
          onCancelReservation={handleCancelReservation}
          onCompleteReservation={handleCompleteReservation}
          onDeleteReservation={handleDeleteReservation}
        />
      </main>
    </div>
  );
}