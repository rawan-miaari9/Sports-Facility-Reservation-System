import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronLeft, 
  Plus, 
  Save, 
  Sparkles, 
  HelpCircle,
  MapPin,
  DollarSign,
  Compass,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { Facility } from '../types';
import { SPORT_TYPES } from '../mockData';

interface ManageFacilityViewProps {
  editingFacility: Facility | null; // Null means create mode
  onSaveFacility: (facility: Facility) => void;
  onCancel: () => void;
}

export default function ManageFacilityView({
  editingFacility,
  onSaveFacility,
  onCancel
}: ManageFacilityViewProps) {
  const isEditMode = editingFacility !== null;

  // Form Step State
  const [currentStep, setCurrentStep] = useState(1);

  // Facility States
  const [name, setName] = useState(editingFacility?.name || '');
  const [type, setType] = useState(editingFacility?.type || 'Basketball');
  const [location, setLocation] = useState(editingFacility?.location || 'Main Wing');
  const [capacity, setCapacity] = useState(editingFacility?.capacity || '12 Pax');
  const [pricePerHour, setPricePerHour] = useState(editingFacility?.pricePerHour || 45);
  const [surface, setSurface] = useState(editingFacility?.surface || 'Pro-Hardwood Surface');
  const [isIndoor, setIsIndoor] = useState(editingFacility?.isIndoor ?? true);
  const [description, setDescription] = useState(editingFacility?.description || '');
  const [image, setImage] = useState(editingFacility?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFPO0A4xcBC7FZ31yS_xtZ6OhkZ4RigUi1IPwrglKmKACde2amhmor-I3IKXubc98RqeY2El_N6TGs1dBXBoQlxWF13ONiTz7QYmJo9tjEEOqh1Acz1PfU-7G_6VCLG_D2e3vGfawKmVrsbr0VgouchsjFWW9006sX_9IIS319_jK7ce59-hlxheKFTFL1m8JBeV--wkjFfHEUgNqt9RI3wlZp_MEn_X1c0DMNBvdWbftDvnOeyCru7kaFrg43OkMxvyPryy5J0Pw');

  // Features checklist
  const [featuresList, setFeaturesList] = useState<string[]>(
    editingFacility?.features || ['High-Lumen LED', 'Electronic Scoreboard']
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

  // Preset images map matching our sports
  const handleSportImagePreset = (sport: string) => {
    setType(sport);
    if (sport === 'Basketball') {
      setImage('https://lh3.googleusercontent.com/aida-public/AB6AXuDFPO0A4xcBC7FZ31yS_xtZ6OhkZ4RigUi1IPwrglKmKACde2amhmor-I3IKXubc98RqeY2El_N6TGs1dBXBoQlxWF13ONiTz7QYmJo9tjEEOqh1Acz1PfU-7G_6VCLG_D2e3vGfawKmVrsbr0VgouchsjFWW9006sX_9IIS319_jK7ce59-hlxheKFTFL1m8JBeV--wkjFfHEUgNqt9RI3wlZp_MEn_X1c0DMNBvdWbftDvnOeyCru7kaFrg43OkMxvyPryy5J0Pw');
      setSurface('Pro-Hardwood Surface');
      setCapacity('12 Pax');
    } else if (sport === 'Tennis') {
      setImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAujDlaKORQ3vfeSg1sm58FO2COMrnktnMa7OR3M2uLZ7BepfvubwrH9JFAJpGePw_ccYNV0rbVof2yIXf6pzF2IZJaEeJqZDIRiBHTDv0NoHEvnKqS5T94if1wBXPTcWRHFfqoiPziUN_jIYHK-tk7eNkWt5aP7lEhmuOYVffzGt6LLyOB90SHfGHUN31F0aw3O-aLxhYeEpYKQVj6aIsO7saZ04A0ZQ0QjdGweiPG6TvIwJD2nm2rzg0lC5TTsLF3eqh48tXXgew');
      setSurface('Premium Red Clay');
      setCapacity('4 Pax');
      setIsIndoor(false);
    } else if (sport === 'Soccer') {
      setImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBGXyUhlyzlfUdX_4Q0W_8x3ad4BSds7AOxRDaVG_sGHTsOUntWRX-bex5-Vy_jJJ5Hy2HM1q_TfUZOkarh0kDJQ_RtaBUN8q8lw5OhInTfhDaQrkBoR6OeeBYmrtrdqqSodhEr9uICi3Vpd1NS-WwP4dKbStr1k9XJn9QVvP7Qh_LGQkfcdfRoH6IFiQtmEM9zccJIZ4X8Lyc0QqKEGaVK5Apzu4M5x4IbV8SKrMs-WbloFfDLe6PcxQX5n3_pjiOIGmkyQ3fRAE4');
      setSurface('Synthetic Turf');
      setCapacity('22 Pax');
      setIsIndoor(false);
    } else if (sport === 'Padel') {
      setImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCNdhoHwC_Jabx1hqo4V_LSEMkTYfwlYdpW9GI7hgfmCHp3qvjhvENGlePLnycHUQr-QLBMGwoAJZj8xIfc-VGIkUFl6QaDFyBVKAhFZfN1xWPTsSglKG585-vCOXluqEpvYCE-yCDHW2qsMgSY5ceE2KeUoElggqnfGvg_84eps30m7MgjoEDW7hNXwTLhw8Cl_eSWUr2G9pzAXW6WYhE9fskljGZxy3lb_5OSRyQcD6OG5gchTQtWwg28UlBrLTFwt_j0hXpDfpA');
      setSurface('Super-Cushioned Blue Turf');
      setCapacity('4 Pax');
    } else if (sport === 'Aquatics') {
      setImage('https://lh3.googleusercontent.com/aida-public/AB6AXuA62v9e1HVltFSGb3ia-Ot9jqo5euNSy6HvDgSXVnQeurs5bxN2RuT-9brgECnWSDdk42dbndh3zsNVq5wNUmPSuLSmrpDN-bAecIRof_yBW-R_yzy4ruV9CB7JGtenypuHUZUaAqjDJftxgW-ecQ3EdkAMD541l7mSz1_OHjFTSYbxFzCJPdfVQHYdPKg_kDQG4uYpMHMMoJ1cegVsdqu-wKApSO69lVsX4QVdTf0OeQ6lPLC5xBnP3-F8oQ9JT6a0Vq8iqGlhJcI');
      setSurface('25m Heated Pool');
      setCapacity('1 Pax');
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Facility Name is required.');
      return;
    }

    const payload: Facility = {
      id: editingFacility?.id || `fac-${Date.now()}`,
      name: name.trim(),
      type,
      location,
      status: editingFacility?.status || 'Available',
      capacity,
      pricePerHour,
      surface,
      image,
      isIndoor,
      description: description.trim() || `Olympic-standard certified arena and training surface dedicated to high-performance ${type} matches and athletic development.`,
      features: featuresList.length > 0 ? featuresList : ['Night Lights', 'High-Lumen LED']
    };

    onSaveFacility(payload);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar bg-background">
      {/* Title */}
      <header className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="p-1.5 bg-white border border-outline-variant hover:bg-surface-container rounded-lg text-outline hover:text-on-surface transition-all cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display font-black text-2xl text-on-surface">
            {isEditMode ? `Edit Arena Settings: ${editingFacility.name}` : 'Provision New Arena'}
          </h1>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Use the 4-step wizard to register surface specs, locations, and pricing parameters into the active grid.
          </p>
        </div>
      </header>

      {/* Progress Indicators Stepper Bar */}
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

      {/* Form content */}
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
                  onChange={(e) => handleSportImagePreset(e.target.value)}
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

        {/* STEP 2: Surface specs */}
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

            {/* Features adders */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Court Feature Specs</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Night LED, Windbreaks, Pro Scoring"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="flex-1 p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none"
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
              STEP 3: RENTAL FEES & MEDIA LINKS
            </span>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Rate Per Hour ($)</label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-xs text-outline font-mono font-bold">$</div>
                <input
                  type="number"
                  placeholder="45"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Facility Preview Hotlink Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface font-mono"
              />
              <span className="text-[10px] text-outline font-mono">Pulls hotlinked high-quality assets automatically according to sport category choice.</span>
            </div>

            {/* Thumbnail Preview box */}
            {image && (
              <div className="pt-2">
                <span className="block text-[10px] font-mono text-outline font-bold uppercase mb-2">HOTLINKED VISUAL PREVIEW</span>
                <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border">
                  <img src={image} alt="Thumbnail preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            )}
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
                <span className="font-bold text-primary font-display">{name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-bold text-outline uppercase">Sport Category:</span>
                <span className="font-bold text-on-surface">{type}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-bold text-outline uppercase">Location Wing:</span>
                <span className="font-bold text-on-surface">{location}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-bold text-outline uppercase">Environment:</span>
                <span className="font-bold text-on-surface">{isIndoor ? 'Indoor AC' : 'Outdoor'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-bold text-outline uppercase">Surface Rating:</span>
                <span className="font-bold text-on-surface">{surface}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-bold text-outline uppercase">HOURLY RATE:</span>
                <span className="font-bold text-primary font-display text-sm">${pricePerHour}/hr</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-outline uppercase">Feature Specs:</span>
                <div className="flex flex-wrap gap-1">
                  {featuresList.map(feat => (
                    <span key={feat} className="bg-white px-2 py-0.5 rounded border text-[10px] font-mono">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary-container/20 text-on-secondary-container rounded-2xl text-xs font-semibold flex items-start gap-2.5 border">
              <CheckCircle2 className="h-4.5 w-4.5 text-secondary shrink-0 mt-0.5" />
              <span>Publishing registers this facility to the live AthleticHub master roster. This activates immediate user scheduler bookings and timeline slots on the dashboard.</span>
            </div>
          </div>
        )}

        {/* Navigation actions */}
        <div className="border-t border-outline-variant pt-6 flex justify-between gap-4">
          <button
            type="button"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onCancel()}
            className="px-5 py-2.5 bg-white border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold text-on-surface-variant cursor-pointer transition-all"
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
              onClick={handleFinalSubmit}
              className="bg-secondary hover:bg-secondary text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-secondary/10 transition-all flex items-center gap-1.5 cursor-pointer"
              id="manage-facility-submit"
            >
              <Save className="h-4.5 w-4.5" />
              {isEditMode ? 'Commit Roster Changes' : 'Publish Arena to Grid'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
