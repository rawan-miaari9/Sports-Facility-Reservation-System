'use client';

import React from 'react';

interface FacilityStepperProps {
  currentStep: number;
}

const STEPS = [
  { label: 'General Info', step: 1 },
  { label: 'Facility Specs', step: 2 },
  { label: 'Set Pricing & Media', step: 3 },
  { label: 'Review & Publish', step: 4 },
];

export const FacilityStepper: React.FC<FacilityStepperProps> = ({ currentStep }) => {
  return (
    <div className="grid grid-cols-4 bg-white border border-outline-variant rounded-2xl p-4 shadow-sm text-center relative overflow-hidden">
      {STEPS.map((item) => {
        const isActive = currentStep === item.step;
        const isPassed = currentStep > item.step;

        return (
          <div key={item.step} className="flex flex-col items-center gap-1.5 relative">
            <span
              className={`w-7 h-7 text-xs font-bold rounded-full flex items-center justify-center font-mono border transition-all ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-md'
                  : isPassed
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-surface-container-low border-outline-variant text-outline'
              }`}
            >
              {item.step}
            </span>
            <span
              className={`text-xs font-semibold ${
                isActive ? 'text-primary' : isPassed ? 'text-secondary' : 'text-outline'
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};