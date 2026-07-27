'use client';

import React from 'react';
import { ArrowRight, Save, Loader2 } from 'lucide-react';

interface StepNavigationControlsProps {
  currentStep: number;
  isSubmitting: boolean;
  isEditMode: boolean;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onFinalSubmit: (e: React.FormEvent) => void;
}

export const StepNavigationControls: React.FC<StepNavigationControlsProps> = ({
  currentStep,
  isSubmitting,
  isEditMode,
  onPreviousStep,
  onNextStep,
  onFinalSubmit,
}) => {
  return (
    <div className="border-t border-outline-variant pt-6 flex justify-between gap-4">
      <button
        type="button"
        disabled={isSubmitting}
        onClick={onPreviousStep}
        className="px-5 py-2.5 bg-white border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold text-on-surface-variant cursor-pointer transition-all disabled:opacity-50"
      >
        {currentStep === 1 ? 'Discard & Return' : 'Previous Step'}
      </button>

      {currentStep < 4 ? (
        <button
          type="button"
          onClick={onNextStep}
          className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onFinalSubmit}
          className="bg-secondary hover:bg-secondary text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-secondary/10 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          id="manage-facility-submit"
        >
          {isSubmitting ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
          ) : (
            <Save className="h-4.5 w-4.5" />
          )}
          {isSubmitting
            ? 'Saving to Database...'
            : isEditMode
            ? 'Commit Roster Changes'
            : 'Publish Arena to Grid'}
        </button>
      )}
    </div>
  );
};