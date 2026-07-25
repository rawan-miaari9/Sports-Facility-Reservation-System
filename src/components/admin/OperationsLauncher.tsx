"use client";

import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { AppView } from '@/types/admin/admin';

interface LauncherProps {
  onViewChange: (view: AppView) => void;
}

export default function OperationsLauncher({ onViewChange }: LauncherProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex-1">
      <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest mb-4">
        OPERATIONS LAUNCHER
      </span>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onViewChange('facilities')}
          className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary/40 text-left transition-all flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="block font-display font-extrabold text-sm text-primary">Add New Arena</span>
            <span className="block text-[10px] text-outline mt-0.5">Manage facilities</span>
          </div>
          <Plus className="h-5 w-5 text-primary" />
        </button>

        <button
          type="button"
          onClick={() => onViewChange('users')}
          className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary/40 text-left transition-all flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="block font-display font-extrabold text-sm text-on-surface">Manage Users</span>
            <span className="block text-[10px] text-outline mt-0.5">Adjust status, roles & spend metrics</span>
          </div>
          <ChevronRight className="h-5 w-5 text-outline" />
        </button>

        <button
          type="button"
          onClick={() => onViewChange('reservations')}
          className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary/40 text-left transition-all flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="block font-display font-extrabold text-sm text-on-surface">Manage Booking</span>
            <span className="block text-[10px] text-outline mt-0.5">Cancel, complete or filter logs</span>
          </div>
          <ChevronRight className="h-5 w-5 text-outline" />
        </button>
      </div>
    </div>
  );
}