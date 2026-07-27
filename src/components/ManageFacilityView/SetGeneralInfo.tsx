'use client';

import React from 'react';

const SPORT_TYPES = ['Basketball', 'Tennis', 'Soccer', 'Padel', 'Aquatics'];

interface StepGeneralInfoProps {
  name: string;
  setName: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  capacity: string | number;
  setCapacity: (val: string | number) => void;
  isIndoor: boolean;
  setIsIndoor: (val: boolean) => void;
}

export const StepGeneralInfo: React.FC<StepGeneralInfoProps> = ({
  name,
  setName,
  type,
  setType,
  location,
  setLocation,
  capacity,
  setCapacity,
  isIndoor,
  setIsIndoor,
}) => {
  return (
    <div className="space-y-4">
      <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
        STEP 1: GENERAL ARENA INFO
      </span>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
          Facility Name *
        </label>
        <input
          type="text"
          placeholder="e.g. Court 3 - Clay Arena"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
            Sport Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface cursor-pointer"
          >
            {SPORT_TYPES.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Main Wing, Outdoor North"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
            Arena Capacity
          </label>
          <input
            type="text"
            placeholder="e.g. 12 Pax, 4 Pax"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
            Environment Type
          </label>
          <div className="grid grid-cols-2 gap-2 h-full">
            <button
              type="button"
              onClick={() => setIsIndoor(true)}
              className={`py-2 rounded-xl border text-xs font-bold ${
                isIndoor
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-container-low border-outline-variant text-outline'
              }`}
            >
              Indoor AC
            </button>
            <button
              type="button"
              onClick={() => setIsIndoor(false)}
              className={`py-2 rounded-xl border text-xs font-bold ${
                !isIndoor
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-container-low border-outline-variant text-outline'
              }`}
            >
              Outdoor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};