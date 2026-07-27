'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Facility } from '@/types/facility/facility';

import { FacilityHeader } from './FacilityHeader';
import { FacilityStepper } from './FacilityStepper';
import { StepGeneralInfo } from './SetGeneralInfo';
import { StepSurfaceSpecs } from './StepSurfaceSpecs';
import { StepPricingMedia } from './StepPricingMedia';
import { StepReview } from './StepReview';
import { StepNavigationControls } from './StepNavigationControls';

interface ManageFacilityViewProps {
  editingFacility: Facility | null;
  onSaveFacility?: (facility: Facility) => void;
  onCancel?: () => void;
}

export default function ManageFacilityView({
  editingFacility,
  onSaveFacility,
  onCancel,
}: ManageFacilityViewProps) {
  const isEditMode = editingFacility !== null;

  // Form Step & Submission State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Facility Form States
  const [name, setName] = useState(editingFacility?.name || '');
  const [type, setType] = useState(editingFacility?.type || 'Basketball');
  const [location, setLocation] = useState(editingFacility?.location || '');
  const [capacity, setCapacity] = useState<string | number>(editingFacility?.capacity || '');
  const [pricePerHour, setPricePerHour] = useState<number | string>(
    editingFacility?.pricePerHour || ''
  );
  const [surface, setSurface] = useState(editingFacility?.surface || '');
  const [isIndoor, setIsIndoor] = useState(editingFacility?.isIndoor ?? true);
  const [description, setDescription] = useState(editingFacility?.description || '');
  const [image, setImage] = useState<string>(editingFacility?.image || '');

  // Features List
  const [featuresList, setFeaturesList] = useState<string[]>(editingFacility?.features || []);
  const [featureInput, setFeatureInput] = useState('');

  const handleAddFeature = () => {
    if (featureInput.trim() && !featuresList.includes(featureInput.trim())) {
      setFeaturesList([...featuresList, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feat: string) => {
    setFeaturesList(featuresList.filter((f) => f !== feat));
  };

  // Local Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size exceeds the 5MB limit. Please choose a smaller image.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Step 1 Validation Check
  const validateStepOne = (): boolean => {
    if (!name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Facility Name is required to proceed.',
        confirmButtonColor: '#3085d6',
      });
      return false;
    }
    return true;
  };

  // Handle Cancel / Discard
  const handleCancelClick = () => {
    if (name.trim() || location.trim() || description.trim() || image) {
      Swal.fire({
        title: 'Discard changes?',
        text: 'Any unsaved parameters will be lost.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, discard',
        cancelButtonText: 'Keep editing',
      }).then((result) => {
        if (result.isConfirmed && onCancel) {
          onCancel();
        }
      });
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStepOne()) return;
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      handleCancelClick();
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStepOne()) return;

    setIsSubmitting(true);

    const facilityId = editingFacility?.id || (editingFacility as any)?._id;

    const parsedCapacity =
      typeof capacity === 'number'
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
      features: featuresList,
    };

    try {
      const targetUrl =
        isEditMode && facilityId ? `/api/facilities/${facilityId}` : '/api/facilities';

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

      const savedData = responseData.data || responseData;

      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Facility Updated!' : 'Facility Published!',
        text: `Successfully saved ${name}.`,
        timer: 2000,
        showConfirmButton: false,
      });

      if (onSaveFacility) {
        onSaveFacility({
          id: savedData._id || savedData.id,
          ...savedData,
        });
      }
    } catch (err: any) {
      console.error('API submission error:', err);

      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.message || 'An error occurred while communicating with the backend.',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar bg-background">
      <FacilityHeader
        isEditMode={isEditMode}
        facilityName={editingFacility?.name}
        isSubmitting={isSubmitting}
        onCancel={handleCancelClick}
      />

      <FacilityStepper currentStep={currentStep} />

      <div className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm max-w-3xl mx-auto space-y-6">
        {currentStep === 1 && (
          <StepGeneralInfo
            name={name}
            setName={setName}
            type={type}
            setType={setType}
            location={location}
            setLocation={setLocation}
            capacity={capacity}
            setCapacity={setCapacity}
            isIndoor={isIndoor}
            setIsIndoor={setIsIndoor}
          />
        )}

        {currentStep === 2 && (
          <StepSurfaceSpecs
            surface={surface}
            setSurface={setSurface}
            description={description}
            setDescription={setDescription}
            featuresList={featuresList}
            featureInput={featureInput}
            setFeatureInput={setFeatureInput}
            onAddFeature={handleAddFeature}
            onRemoveFeature={handleRemoveFeature}
          />
        )}

        {currentStep === 3 && (
          <StepPricingMedia
            pricePerHour={pricePerHour}
            setPricePerHour={setPricePerHour}
            image={image}
            setImage={setImage}
            onImageUpload={handleImageUpload}
          />
        )}

        {currentStep === 4 && (
          <StepReview
            name={name}
            type={type}
            location={location}
            isIndoor={isIndoor}
            surface={surface}
            pricePerHour={pricePerHour}
            featuresList={featuresList}
          />
        )}

        <StepNavigationControls
          currentStep={currentStep}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
          onFinalSubmit={handleFinalSubmit}
        />
      </div>
    </div>
  );
}