"use client";

import React from 'react';

interface StatsProps {
  stats: {
    totalSystemBookings: number;
    activeFacilitiesCount: number;
    totalFacilitiesCount: number;
    totalSystemUsers: number;
    estimatedRevenue: number;
  };
}

export default function AdminStatsGrid({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
        <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">
          Total Active Bookings
        </span>
        <span className="block font-display font-black text-3xl text-primary mt-1.5">
          {stats.totalSystemBookings} slots
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
        <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">
          Arenas Operational
        </span>
        <span className="block font-display font-black text-3xl text-on-surface mt-1.5">
          {stats.activeFacilitiesCount} / {stats.totalFacilitiesCount}
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
        <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">
          Registered Members
        </span>
        <span className="block font-display font-black text-3xl text-primary mt-1.5">
          {stats.totalSystemUsers} users
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden">
        <span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">
          Estimated Revenue
        </span>
        <span className="block font-display font-black text-3xl text-secondary mt-1.5">
          ${stats.estimatedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}