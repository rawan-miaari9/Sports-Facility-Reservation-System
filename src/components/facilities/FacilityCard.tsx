'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { Facility } from './FacilitiesView';

interface FacilityCardProps {
  facility: Facility;
  isAdmin: boolean;
  onNavigateToManage?: (facility: Facility | null) => void;
  onBookSlot: (facility: Facility) => void;
}

export function FacilityCard({
  facility,
  isAdmin,
  onNavigateToManage,
  onBookSlot
}: FacilityCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img 
          src={facility.image} 
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-primary shadow-sm border border-outline-variant/60">
          {facility.type}
        </div>

        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold shadow-sm ${
          facility.status === 'Available' 
            ? 'bg-emerald-100 text-emerald-800' 
            : 'bg-amber-100 text-amber-800'
        }`}>
          {facility.status}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-1 text-[11px] text-outline font-mono">
            <MapPin className="h-3.5 w-3.5" />
            {facility.location} • {facility.isIndoor ? 'Indoor' : 'Outdoor'}
          </div>

          <h3 className="font-display font-bold text-base text-on-surface group-hover:text-primary transition-colors">
            {facility.name}
          </h3>

          <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3">
            {facility.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {facility.features?.map((feature, idx) => (
              <span 
                key={idx} 
                className="bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded text-[9px] font-mono font-semibold"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-outline-variant mt-6 pt-4 flex items-center justify-between">
          <div>
            <span className="block text-[9px] font-mono uppercase tracking-wider text-outline font-bold">RATE</span>
            <span className="font-display font-black text-lg text-primary">
              ${facility.pricePerHour}
              <span className="text-xs font-medium text-outline"> / hr</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onNavigateToManage && (
              <button
                onClick={() => onNavigateToManage(facility)}
                className="bg-surface-container hover:bg-primary hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold text-primary transition-all cursor-pointer flex items-center gap-1.5"
              >
                Edit Arena
              </button>
            )}
            <button
              onClick={() => onBookSlot(facility)}
              disabled={facility.status === 'Maintenance'}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                facility.status === 'Maintenance' 
                  ? 'bg-outline-variant/50 text-outline cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-container text-white shadow-md shadow-primary/10'
              }`}
            >
              Book Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}