'use client';

import React from 'react';

interface StepSurfaceSpecsProps {
  surface: string;
  setSurface: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  featuresList: string[];
  featureInput: string;
  setFeatureInput: (val: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (feat: string) => void;
}

export const StepSurfaceSpecs: React.FC<StepSurfaceSpecsProps> = ({
  surface,
  setSurface,
  description,
  setDescription,
  featuresList,
  featureInput,
  setFeatureInput,
  onAddFeature,
  onRemoveFeature,
}) => {
  return (
    <div className="space-y-4">
      <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
        STEP 2: SURFACE CHARACTERISTICS
      </span>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
          Surface Material Type
        </label>
        <input
          type="text"
          placeholder="e.g. Premium Red Clay, Hardwood Surface"
          value={surface}
          onChange={(e) => setSurface(e.target.value)}
          className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
          Facility Description
        </label>
        <textarea
          rows={3}
          placeholder="Describe the physical courts quality standards..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
          Court Feature Specs
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Night LED, Windbreaks, Pro Scoring"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddFeature())}
            className="flex-1 p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none text-on-surface"
          />
          <button
            type="button"
            onClick={onAddFeature}
            className="bg-primary hover:bg-primary-container text-white px-4 rounded-xl text-xs font-bold cursor-pointer"
          >
            Add Spec
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {featuresList.map((feat) => (
            <span
              key={feat}
              className="bg-primary/5 text-primary border border-primary/20 px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              {feat}
              <button
                type="button"
                onClick={() => onRemoveFeature(feat)}
                className="text-outline hover:text-error font-black"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};