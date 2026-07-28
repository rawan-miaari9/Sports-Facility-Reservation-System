'use client';

import React, { useEffect } from 'react';
import LandingPage from '../components/LandingPage';
import { INITIAL_FACILITIES } from '../mockData';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <LandingPage
      facilities={INITIAL_FACILITIES}
      onGetStarted={() => router.push('/dashboard')}
      onLoginClick={() => router.push('/auth')}
      onSelectFacility={() => {
        router.push('/facilities');
      }}
    />
  );
}