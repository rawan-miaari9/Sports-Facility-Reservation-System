'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronLeft, 
  Save, 
  ArrowRight,
  Loader2,
  Upload,
  X
} from 'lucide-react';
import { Facility } from '@/types/facility/facility';

// Sport options list replacing external mockData
const SPORT_TYPES = ['Basketball', 'Tennis', 'Soccer', 'Padel', 'Aquatics'];

interface ManageFacilityViewProps {
  editingFacility: Facility | null;
  onSaveFacility?: (facility: Facility) => void;
  onCancel?: () => void;
}

export default function ManageFacilityView({
  editingFacility,
  onSaveFacility,
  onCancel
}: ManageFacilityViewProps) {
  const isEditMode = editingFacility !== null;

  // Form Step & Submission State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Facility Form States (Cleaned defaults when creating new arena)
  const [name, setName] = useState(editingFacility?.name || '');
  const [type, setType] = useState(editingFacility?.type || 'Basketball');
  const [location, setLocation] = useState(editingFacility?.location || '');
  const [capacity, setCapacity] = useState<string | number>(editingFacility?.capacity || '');
  const [pricePerHour, setPricePerHour] = useState<number | string>(editingFacility?.pricePerHour || '');
  const [surface, setSurface] = useState(editingFacility?.surface || '');
  const [isIndoor, setIsIndoor] = useState(editingFacility?.isIndoor ?? true);
  const [description, setDescription] = useState(editingFacility?.description || '');
  const [image, setImage] = useState<string>(editingFacility?.image || '');

  // Features List
  const [featuresList, setFeaturesList] = useState<string[]>(
    editingFacility?.features || []
  );
  const [featureInput, setFeatureInput] = useState('');

  const handleAddFeature = () => {
    if (featureInput.trim() && !featuresList.includes(featureInput.trim())) {
      setFeaturesList([...featuresList, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feat: string) => {
    setFeaturesList(featuresList.filter(f => f !== feat));
  };

  // Local Image Upload Handler (reads file from laptop & converts to Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Facility Name is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const facilityId = editingFacility?.id || (editingFacility as any)?._id;

    const parsedCapacity = typeof capacity === 'number' 
      ? capacity 
      : parseInt(String(capacity).replace(/\D/g, ''), 10) || 1;

    const payload = {
      name: name.trim(),
      type,
      location: location.trim(),
      status: editingFacility?.status || 'Available',
      capacity: parsedCapacity,
      pricePerHour: Number(pricePerHour) || 0,
      surface: surface.trim(),
      image,
      isIndoor,
      description: description.trim(),
      features: featuresList
    };

    try {
      const targetUrl = isEditMode && facilityId 
        ? `/api/facilities/${facilityId}` 
        : '/api/facilities';
        
      const method = isEditMode && facilityId ? 'PUT' : 'POST';

      const res = await fetch(targetUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to submit facility data to server.');
      }

      if (onSaveFacility) {
        const savedData = responseData.data || responseData;
        onSaveFacility({
          id: savedData._id || savedData.id,
          ...savedData
        });
      }
    } catch (err: any) {
      console.error('API submission error:', err);
      setErrorMessage(err.message || 'An error occurred while communicating with the backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar bg-background">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="p-1.5 bg-white border border-outline-variant hover:bg-surface-container rounded-lg text-outline hover:text-on-surface transition-all cursor-pointer disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display font-black text-2xl text-on-surface">
            {isEditMode ? `Edit Arena Settings: ${editingFacility.name}` : 'Provision New Arena'}
          </h1>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Use the 4-step wizard to register surface specs, locations, and pricing parameters into the database.
          </p>
        </div>
      </header>

      {/* Stepper Bar */}
      <div className="grid grid-cols-4 bg-white border border-outline-variant rounded-2xl p-4 shadow-sm text-center relative overflow-hidden">
        {[
          { label: 'Core Specs', step: 1 },
          { label: 'Surface Specs', step: 2 },
          { label: 'Rates & Image', step: 3 },
          { label: 'Publish Review', step: 4 }
        ].map((item) => {
          const isActive = currentStep === item.step;
          const isPassed = currentStep > item.step;

          return (
            <div key={item.step} className="flex flex-col items-center gap-1.5 relative">
              <span className={`w-7 h-7 text-xs font-bold rounded-full flex items-center justify-center font-mono border transition-all ${
                isActive 
                  ? 'bg-primary text-white border-primary shadow-md' 
                  : isPassed 
                  ? 'bg-secondary text-white border-secondary' 
                  : 'bg-surface-container-low border-outline-variant text-outline'
              }`}>
                {item.step}
              </span>
              <span className={`text-xs font-semibold ${isActive ? 'text-primary' : isPassed ? 'text-secondary' : 'text-outline'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* API Error Notification */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold max-w-3xl mx-auto">
          {errorMessage}
        </div>
      )}

      {/* Step Form Container */}
      <div className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm max-w-3xl mx-auto space-y-6">
        
        {/* STEP 1: Core Specs */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
              STEP 1: CORE ARENA PARAMETERS
            </span>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Facility Name</label>
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
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Sport Category Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface cursor-pointer"
                >
                  {SPORT_TYPES.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">General Location Wing</label>
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
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Athlete Capacity</label>
                <input
                  type="text"
                  placeholder="e.g. 12 Pax, 4 Pax"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Environment Type</label>
                <div className="grid grid-cols-2 gap-2 h-full">
                  <button
                    type="button"
                    onClick={() => setIsIndoor(true)}
                    className={`py-2 rounded-xl border text-xs font-bold ${
                      isIndoor ? 'bg-primary text-white border-primary' : 'bg-surface-container-low border-outline-variant text-outline'
                    }`}
                  >
                    Indoor AC
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsIndoor(false)}
                    className={`py-2 rounded-xl border text-xs font-bold ${
                      !isIndoor ? 'bg-primary text-white border-primary' : 'bg-surface-container-low border-outline-variant text-outline'
                    }`}
                  >
                    Outdoor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Surface Specs */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
              STEP 2: PHYSICAL SURFACE CHARACTERISTICS
            </span>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Surface Material Type</label>
              <input
                type="text"
                placeholder="e.g. Premium Red Clay, Hardwood Surface"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Public/Roster Description</label>
              <textarea
                rows={3}
                placeholder="Describe the physical courts quality standards..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Court Feature Specs</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Night LED, Windbreaks, Pro Scoring"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="flex-1 p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none text-on-surface"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
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
                      onClick={() => handleRemoveFeature(feat)}
                      className="text-outline hover:text-error font-black"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Rates & Image */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
              STEP 3: RENTAL FEES & LOCAL IMAGE UPLOAD
            </span>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Rate Per Hour ($)</label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-xs text-outline font-mono font-bold">$</div>
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
              <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Facility Image (Local Laptop Upload)</label>
              
              {!image ? (
                <label className="border-2 border-dashed border-outline-variant hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-surface-container-low hover:bg-surface-container">
                  <Upload className="h-6 w-6 text-outline" />
                  <span className="text-xs font-semibold text-on-surface">Click to upload an image from your device</span>
                  <span className="text-[10px] text-outline">Supports PNG, JPG, WEBP (Max 5MB)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
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
        )}

        {/* STEP 4: Publish Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
              STEP 4: AUDIT SPECS & CONSOLIDATE TO SYSTEM
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
                <span className="font-bold text-on-surface">{isIndoor ? 'Indoor AC' : 'Outdoor'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-bold text-outline uppercase">Surface Rating:</span>
                <span className="font-bold text-on-surface">{surface || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-bold text-outline uppercase">HOURLY RATE:</span>
                <span className="font-bold text-primary font-display text-sm">${pricePerHour || 0}/hr</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-outline uppercase">Feature Specs:</span>
                <div className="flex flex-wrap gap-1">
                  {featuresList.length > 0 ? (
                    featuresList.map(feat => (
                      <span key={feat} className="bg-white px-2 py-0.5 rounded border text-[10px] font-mono">
                        {feat}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-outline">None specified</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary-container/20 text-on-secondary-container rounded-2xl text-xs font-semibold flex items-start gap-2.5 border">
              <CheckCircle2 className="h-4.5 w-4.5 text-secondary shrink-0 mt-0.5" />
              <span>Publishing writes this record directly to MongoDB. This activates immediate user scheduler bookings and timeline slots on the dashboard.</span>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="border-t border-outline-variant pt-6 flex justify-between gap-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onCancel?.()}
            className="px-5 py-2.5 bg-white border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold text-on-surface-variant cursor-pointer transition-all disabled:opacity-50"
          >
            {currentStep === 1 ? 'Discard & Return' : 'Previous Step'}
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1 && !name.trim()) {
                  alert('Facility Name is required.');
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
              className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="bg-secondary hover:bg-secondary text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-secondary/10 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              id="manage-facility-submit"
            >
              {isSubmitting ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <Save className="h-4.5 w-4.5" />
              )}
              {isSubmitting ? 'Saving to Database...' : isEditMode ? 'Commit Roster Changes' : 'Publish Arena to Grid'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}