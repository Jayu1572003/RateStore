import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../lib/axios';
import { useToast } from '../contexts/ToastContext';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(16, 'New password cannot exceed 16 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[!@#$%^&*]/, 'Must contain at least one special character (!@#$%^&*)'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await api.patch('/users/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      showToast('Password updated successfully', 'success');
      reset();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update password';
      setApiError(Array.isArray(msg) ? msg[0] : msg);
      showToast('Password update failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Update Password
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Change your account password
          </p>
        </div>

        {apiError && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              {...register('currentPassword')}
              placeholder="••••••••"
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                errors.currentPassword
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              New Password (8-16 chars, 1 Upper, 1 Special)
            </label>
            <input
              type="password"
              {...register('newPassword')}
              placeholder="••••••••"
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                errors.newPassword
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.newPassword && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              {...register('confirmNewPassword')}
              placeholder="••••••••"
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                errors.confirmNewPassword
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.confirmNewPassword && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
