'use client';

import React, { useState, useEffect } from 'react';
import ManageFacilityView from '@/components/ManageFacilityView/ManageFacilityView';

export default function ManageFacilityPage() {
  return (
    <main className="min-h-screen bg-background">
      <ManageFacilityView 
        editingFacility={null} 
        onSaveFacility={(facility) => {
          console.log('Successfully saved facility:', facility);
        }}
        onCancel={() => {
          console.log('Action cancelled');
        }}
      />
    </main>
  );
}