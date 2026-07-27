'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface FacilityHeaderProps {
  isEditMode: boolean;
  facilityName?: string;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FacilityHeader: React.FC<FacilityHeaderProps> = ({
  isEditMode,
  facilityName,
  isSubmitting,
  onCancel,
}) => {
  return (
    <header className="flex items-center gap-3">
      <button
        onClick={onCancel}
        disabled={isSubmitting}
        className="p-1.5 bg-white border border-outline-variant hover:bg-surface-container rounded-lg text-outline hover:text-on-surface transition-all cursor-pointer disabled:opacity-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div>
        <h1 className="font-display font-black text-2xl text-on-surface">
          {isEditMode ? `Edit Arena Settings: ${facilityName}` : 'Provision New Arena'}
        </h1>
      </div>
    </header>
  );
};