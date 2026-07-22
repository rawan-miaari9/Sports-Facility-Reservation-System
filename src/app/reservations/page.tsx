'use client';

import React from 'react';
import ReservationsView from '../../components/ReservationsView';
import { useRouter } from 'next/navigation';

export default function ReservationsPage() {
  const router = useRouter();

  return (
    <ReservationsView
      reservations={[]}
      currentUser={{ name: 'User', role: 'Athlete' } as any}
      onCancelReservation={(id: string) => console.log('Cancel reservation', id)}
      {...({} as any)}
    />
  );
}