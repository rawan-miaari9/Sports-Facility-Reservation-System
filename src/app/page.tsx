'use client';

import React from 'react';
import Head from 'next/head'
import LandingPage from '../components/LandingPage';
import { INITIAL_FACILITIES } from '../mockData';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <>

    <head>
      <title>Athletic Hub | Home</title>
    </head>

    <LandingPage
      facilities={INITIAL_FACILITIES}
      onGetStarted={() => router.push('/dashboard')}
      onLoginClick={() => router.push('/auth')}
      onSelectFacility={() => {
       router.push('/facilities');
      }}
    />
     </>
  );
}