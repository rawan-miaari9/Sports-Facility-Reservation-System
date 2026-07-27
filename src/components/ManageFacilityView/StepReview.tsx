'use client';

import React from 'react';

interface StepReviewProps {
  name: string;
  type: string;
  location: string;
  isIndoor: boolean;
  surface: string;
  pricePerHour: number | string;
  featuresList: string[];
}

export const StepReview: React.FC<StepReviewProps> = ({
  name,
  type,
  location,
  isIndoor,
  surface,
  pricePerHour,
  featuresList,
}) => {
  return (
    <div className="space-y-6">
      <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
        STEP 4: Verify Specifications & Save
      </span>

      <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant space-y-4 text-xs font-medium text-on-surface-variant">
        <div className="flex justify-between border-b pb-2">
          <span className="font-bold text-outline uppercase">Court Name:</span>
          <span className="font-bold text-primary font-display">{name || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-bold text-outline uppercase">Sport Category:</span>
          <span className="font-bold text-on-surface">{type}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-bold text-outline uppercase">Location Wing:</span>
          <span className="font-bold text-on-surface">{location || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-bold text-outline uppercase">Environment:</span>
          <span className="font-bold text-on-surface">
            {isIndoor ? 'Indoor AC' : 'Outdoor'}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-bold text-outline uppercase">Surface Rating:</span>
          <span className="font-bold text-on-surface">{surface || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-bold text-outline uppercase">HOURLY RATE:</span>
          <span className="font-bold text-primary font-display text-sm">
            ${pricePerHour || 0}/hr
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-outline uppercase">Feature Specs:</span>
          <div className="flex flex-wrap gap-1">
            {featuresList.length > 0 ? (
              featuresList.map((feat) => (
                <span
                  key={feat}
                  className="bg-white px-2 py-0.5 rounded border text-[10px] font-mono"
                >
                  {feat}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-outline">None specified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};