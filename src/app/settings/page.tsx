'use client';

import React from 'react';
import SettingsView from '../../components/SettingsView';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <SettingsView
      currentUser={{ name: 'User', role: 'Athlete' } as any}
      {...({} as any)}
    />
  );
}