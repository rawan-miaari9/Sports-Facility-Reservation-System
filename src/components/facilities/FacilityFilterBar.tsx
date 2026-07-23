'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface FacilityFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedSport: string;
  setSelectedSport: (val: string) => void;
  indoorFilter: 'All' | 'Indoor' | 'Outdoor';
  setIndoorFilter: (val: 'All' | 'Indoor' | 'Outdoor') => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  sportTypes: string[];
  onReset: () => void;
}

export function FacilityFilterBar({
  searchTerm,
  setSearchTerm,
  selectedSport,
  setSelectedSport,
  indoorFilter,
  setIndoorFilter,
  maxPrice,
  setMaxPrice,
  sportTypes,
  onReset
}: FacilityFilterBarProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-outline" />
          <input
            type="text"
            placeholder="Search arenas by keywords, features, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="bg-white px-4 py-3 border border-outline-variant rounded-xl text-xs font-bold text-primary focus:outline-none cursor-pointer"
          >
            <option value="All">All Sports</option>
            {sportTypes.map((sport) => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>

          <select
            value={indoorFilter}
            onChange={(e) => setIndoorFilter(e.target.value as 'All' | 'Indoor' | 'Outdoor')}
            className="bg-white px-4 py-3 border border-outline-variant rounded-xl text-xs font-bold text-primary focus:outline-none cursor-pointer"
          >
            <option value="All">All Environments</option>
            <option value="Indoor">Indoors Only</option>
            <option value="Outdoor">Outdoors Only</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-outline-variant/60 pt-4 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-xs font-mono text-outline font-bold uppercase">Rate Cap:</span>
          <input 
            type="range"
            min="20"
            max="200"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="flex-1 accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer"
          />
          <span className="font-display font-black text-sm text-primary">${maxPrice}/hr</span>
        </div>

        <button 
          onClick={onReset}
          className="text-xs font-bold text-outline hover:text-primary transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}