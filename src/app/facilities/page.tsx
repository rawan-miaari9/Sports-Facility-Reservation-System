'use client';

import React from 'react';
import FacilitiesView from '../../components/FacilitiesView';
import { INITIAL_FACILITIES } from '../../mockData';
import { useRouter } from 'next/navigation';

export default function FacilitiesPage() {
  const router = useRouter();

  return (
    <FacilitiesView
      facilities={INITIAL_FACILITIES}
      currentUser={{ name: 'User', role: 'Athlete' } as any}
      {...({} as any)}
    />
  );
}