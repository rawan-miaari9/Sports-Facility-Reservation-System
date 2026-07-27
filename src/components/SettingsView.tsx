import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  Save, 
  CheckCircle2, 
  Lock,
  Loader2,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { User } from '../types/admin/admin';
import { updateProfileSchema, changePasswordSchema } from '../validators/auth/auth';

interface SettingsViewProps {
  currentUser: User & {
    phone?: string;
    phoneNumber?: string;
    mobile?: string;
    dateOfBirth?: string | Date;
    dob?: string | Date;
    birthDate?: string | Date;
  };
  onUpdateProfile: (updated: User) => void;
}

export default function SettingsView({ currentUser, onUpdateProfile }: SettingsViewProps) {
  const userId = currentUser._id || currentUser.id;

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

  const getPhoneValue = (user: typeof currentUser) => 
    user?.phone || user?.phoneNumber || user?.mobile || '';

  const getDobValue = (user: typeof currentUser) => 
    formatDateForInput(user?.dateOfBirth || user?.dob || user?.birthDate);

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(() => getPhoneValue(currentUser));
  const [dob, setDob] = useState(() => getDobValue(currentUser));

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(getPhoneValue(currentUser));
      setDob(getDobValue(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchFreshUserData() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const freshUser = await res.json();
          onUpdateProfile(freshUser);
        }
      } catch (err) {
        console.error("Failed to fetch fresh user data:", err);
      }
    }

    fetchFreshUserData();
  }, [userId]);

  const memberSinceFormatted = currentUser?.createdAt 
    ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'N/A';

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});
    setProfileSuccess(false);

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
      setProfileErrors(formattedErrors);
      return;
    }

    setIsSavingProfile(true);

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
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: unknown) {
      setProfileErrors({ form: err instanceof Error ? err.message : 'An unexpected error occurred.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    setPasswordSuccess(false);

    const validationResult = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setPasswordErrors(formattedErrors);
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await fetch(`/api/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: validationResult.data.currentPassword,
          newPassword: validationResult.data.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password.');
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      setPasswordErrors({ form: err instanceof Error ? err.message : 'An unexpected error occurred.' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar bg-background">
      <header>
        <h1 className="font-display font-black text-2xl text-on-surface">
          Profile & Settings Control
        </h1>
        <p className="text-on-surface-variant text-xs mt-0.5">
          Manage your credentials, update contact records, and sync security preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          
          <form onSubmit={handleProfileSave}>
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm space-y-5">
              <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant/60 pb-3">
                USER ROSTER DETAILS
              </span>

              {profileSuccess && (
                <div className="p-3.5 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold flex items-center gap-2 border border-secondary/20">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                  Profile details synchronized successfully with database!
                </div>
              )}

              {profileErrors.form && (
                <div className="p-3.5 bg-red-100 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
                  {profileErrors.form}
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
                  {profileErrors.name && (
                    <span className="text-[11px] text-red-600 font-medium">{profileErrors.name}</span>
                  )}
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
                  {profileErrors.email && (
                    <span className="text-[11px] text-red-600 font-medium">{profileErrors.email}</span>
                  )}
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
                  {profileErrors.phone && (
                    <span className="text-[11px] text-red-600 font-medium">{profileErrors.phone}</span>
                  )}
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
                  {profileErrors.dateOfBirth && (
                    <span className="text-[11px] text-red-600 font-medium">{profileErrors.dateOfBirth}</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="bg-primary hover:bg-primary-container disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer mt-4"
              >
                {isSavingProfile ? (
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

          <form onSubmit={handlePasswordChange}>
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm space-y-5">
              <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest border-b border-outline-variant/60 pb-3">
                ACCOUNT SECURITY & PASSWORD
              </span>

              {passwordSuccess && (
                <div className="p-3.5 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold flex items-center gap-2 border border-secondary/20">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                  Your password has been updated successfully!
                </div>
              )}

              {passwordErrors.form && (
                <div className="p-3.5 bg-red-100 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
                  {passwordErrors.form}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Current Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                    />
                  </div>
                  {passwordErrors.currentPassword && (
                    <span className="text-[11px] text-red-600 font-medium">{passwordErrors.currentPassword}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Uppercase, lowercase, number, symbol"
                        className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                      />
                    </div>
                    {passwordErrors.newPassword && (
                      <span className="text-[11px] text-red-600 font-medium">{passwordErrors.newPassword}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-outline" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary text-on-surface"
                      />
                    </div>
                    {passwordErrors.confirmPassword && (
                      <span className="text-[11px] text-red-600 font-medium">{passwordErrors.confirmPassword}</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingPassword}
                className="bg-outline hover:bg-on-surface text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer mt-4"
              >
                {isSavingPassword ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4.5 w-4.5" />
                    Update Security Credentials
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm text-center space-y-4">
            <span className="block text-[10px] font-mono text-outline font-bold uppercase tracking-widest">
              MEMBERSHIP METRIC CARD
            </span>

            <div className="w-16 h-16 rounded-2xl bg-primary text-white font-display font-black text-xl flex items-center justify-center border shadow-md mx-auto">
              {name ? name.split(' ').map((n: string) => n.charAt(0)).join('') : 'U'}
            </div>

            <div>
              <span className="block font-display font-black text-base text-on-surface">{name}</span>
              <span className="block text-xs text-outline font-mono mt-0.5">{email}</span>
            </div>

            <div className="pt-4 border-t border-outline-variant/60 grid grid-cols-2 text-center text-xs gap-4 font-mono">
              <div>
                <span className="block text-[9px] text-outline uppercase font-bold">Roster Role</span>
                <span className="font-bold text-primary block mt-0.5 capitalize">{currentUser?.role || 'user'}</span>
              </div>
              <div>
                <span className="block text-[9px] text-outline uppercase font-bold">Member Since</span>
                <span className="font-bold text-on-surface block mt-0.5">{memberSinceFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}