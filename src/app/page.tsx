'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from '../components/LandingPage';
import { INITIAL_FACILITIES } from '../mockData';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    document.title = 'Athletic Hub';
    
    // Load the logged-in user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        // Handle parsing error gracefully if needed
      }
    }
  }, []);

  return (
    <LandingPage
      currentUser={currentUser}
      facilities={INITIAL_FACILITIES}
      onGetStarted={() => router.push('/dashboard')}
      onLoginClick={() => router.push('/auth')}
      onSelectFacility={() => {
        router.push('/facilities');
      }}
    />
  );
}