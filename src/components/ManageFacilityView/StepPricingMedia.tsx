'use client';

import React from 'react';
import { Upload, X } from 'lucide-react';

interface StepPricingMediaProps {
  pricePerHour: number | string;
  setPricePerHour: (val: number | string) => void;
  image: string;
  setImage: (val: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StepPricingMedia: React.FC<StepPricingMediaProps> = ({
  pricePerHour,
  setPricePerHour,
  image,
  setImage,
  onImageUpload,
}) => {
  return (
    <div className="space-y-4">
      <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
        STEP 3: RENTAL FEES & IMAGE UPLOAD
      </span>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
          Rate Per Hour ($)
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-3.5 text-xs text-outline font-mono font-bold">
            $
          </div>
          <input
            type="number"
            placeholder="0.00"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
          Facility Image
        </label>

        {!image ? (
          <label className="border-2 border-dashed border-outline-variant hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-surface-container-low hover:bg-surface-container">
            <Upload className="h-6 w-6 text-outline" />
            <span className="text-xs font-semibold text-on-surface">
              Click to upload an image from your device
            </span>
            <span className="text-[10px] text-outline">Supports PNG, JPG, WEBP</span>
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-outline-variant group">
            <img src={image} alt="Arena preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImage('')}
              className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-all cursor-pointer"
              title="Remove Image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};