import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Calendar, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { User } from '../../types/admin/admin';
import { updateProfileSchema } from '../../validators/auth/auth';

interface ProfileDetailsFormProps {
  currentUser: User & {
    phone?: string;
    phoneNumber?: string;
    mobile?: string;
    dateOfBirth?: string | Date;
    dob?: string | Date;
    birthDate?: string | Date;
  };
  userId: string;
  onUpdateProfile: (updated: User) => void;
}

const formatDateForInput = (dateVal?: string | Date) => {
  if (!dateVal) return '';
  try {
    if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateVal)) {
      return dateVal.slice(0, 10);
    }
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

const getPhoneValue = (user: ProfileDetailsFormProps['currentUser']) => 
  user?.phone || user?.phoneNumber || user?.mobile || '';

const getDobValue = (user: ProfileDetailsFormProps['currentUser']) => 
  formatDateForInput(user?.dateOfBirth || user?.dob || user?.birthDate);

export default function ProfileDetailsForm({ currentUser, userId, onUpdateProfile }: ProfileDetailsFormProps) {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(() => getPhoneValue(currentUser));
  const [dob, setDob] = useState(() => getDobValue(currentUser));

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(getPhoneValue(currentUser));
      setDob(getDobValue(currentUser));
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSuccess(false);

    const validationResult = updateProfileSchema.safeParse({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      dateOfBirth: dob,
    });

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validationResult.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile details.');
      }

      const updatedUser: User = {
        ...currentUser,
        ...data,
        id: data.id || data._id || currentUser.id,
      };

      onUpdateProfile(updatedUser);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: unknown) {
      setErrors({ form: err instanceof Error ? err.message : 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm space-y-5">
        <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant/60 pb-3">
          USER ROSTER DETAILS
        </span>

        {isSuccess && (
          <div className="p-3.5 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold flex items-center gap-2 border border-secondary/20">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            Profile details synchronized successfully with database!
          </div>
        )}

        {errors.form && (
          <div className="p-3.5 bg-red-100 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
            {errors.name && <span className="text-[11px] text-red-600 font-medium">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
            {errors.email && <span className="text-[11px] text-red-600 font-medium">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
            {errors.phone && <span className="text-[11px] text-red-600 font-medium">{errors.phone}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface cursor-pointer"
              />
            </div>
            {errors.dateOfBirth && <span className="text-[11px] text-red-600 font-medium">{errors.dateOfBirth}</span>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-primary hover:bg-primary-container disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer mt-4"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              Saving to Database...
            </>
          ) : (
            <>
              <Save className="h-4.5 w-4.5" />
              Synchronize Profile Details
            </>
          )}
        </button>
      </div>
    </form>
  );
}