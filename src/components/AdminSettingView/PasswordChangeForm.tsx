import React, { useState } from 'react';
import { Lock, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { changePasswordSchema } from '../../validators/auth/auth';

interface PasswordChangeFormProps {
  userId: string;
}

export default function PasswordChangeForm({ userId }: PasswordChangeFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSuccess(false);

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
      setErrors(formattedErrors);
      return;
    }

    setIsSaving(true);

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

      setIsSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
          ACCOUNT SECURITY & PASSWORD
        </span>

        {isSuccess && (
          <div className="p-3.5 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold flex items-center gap-2 border border-secondary/20">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            Your password has been updated successfully!
          </div>
        )}

        {errors.form && (
          <div className="p-3.5 bg-red-100 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
            {errors.form}
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
            {errors.currentPassword && <span className="text-[11px] text-red-600 font-medium">{errors.currentPassword}</span>}
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
              {errors.newPassword && <span className="text-[11px] text-red-600 font-medium">{errors.newPassword}</span>}
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
              {errors.confirmPassword && <span className="text-[11px] text-red-600 font-medium">{errors.confirmPassword}</span>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-outline hover:bg-on-surface text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer mt-4"
        >
          {isSaving ? (
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
  );
}