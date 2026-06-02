import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useToast } from '../../contexts/ToastContext';

const addUserSchema = z
  .object({
    name: z
      .string()
      .min(20, 'Name must be at least 20 characters')
      .max(60, 'Name cannot exceed 60 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(16, 'Password cannot exceed 16 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[!@#$%^&*]/, 'Must contain at least one special character (!@#$%^&*)'),
    address: z
      .string()
      .min(1, 'Address is required')
      .max(400, 'Address cannot exceed 400 characters'),
    role: z.enum(['admin', 'normal_user', 'store_owner']),
    storeName: z.string().optional(),
    storeEmail: z.string().optional(),
    storeAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'store_owner') {
      if (!data.storeName || data.storeName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Store name is required for store owners',
          path: ['storeName'],
        });
      }
      if (!data.storeEmail || data.storeEmail.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Store email is required for store owners',
          path: ['storeEmail'],
        });
      } else if (!/\S+@\S+\.\S+/.test(data.storeEmail)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid store email address',
          path: ['storeEmail'],
        });
      }
      if (!data.storeAddress || data.storeAddress.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Store address is required for store owners',
          path: ['storeAddress'],
        });
      } else if (data.storeAddress.length > 400) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Store address cannot exceed 400 characters',
          path: ['storeAddress'],
        });
      }
    }
  });

type AddUserFormValues = z.infer<typeof addUserSchema>;

const AdminAddUser: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      role: 'normal_user',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: AddUserFormValues) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      // Body shape expects standard fields, and store owner fields if applicable
      const payload: any = {
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
        role: data.role,
      };

      if (data.role === 'store_owner') {
        payload.storeName = data.storeName;
        payload.storeEmail = data.storeEmail;
        payload.storeAddress = data.storeAddress;
      }

      await api.post('/users', payload);
      showToast('User created successfully', 'success');
      navigate('/admin/users');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create user';
      setApiError(Array.isArray(msg) ? msg[0] : msg);
      showToast('User creation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border-none bg-transparent"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-slate-900">Add New User</h2>
          <p className="mt-1 text-sm text-slate-500">
            Create an administrator, normal user, or store owner account
          </p>
        </div>

        {apiError && (
          <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Account Role
              </label>
              <select
                {...register('role')}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="normal_user">Normal User</option>
                <option value="admin">Administrator</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="user@example.com"
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.email ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Full Name (Min 20 characters)
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="Johnathan Doe Placeholder Name"
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.name ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.password ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Personal Address
              </label>
              <textarea
                {...register('address')}
                placeholder="Enter personal address..."
                rows={2}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.address ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Conditional store owner fields */}
          {selectedRole === 'store_owner' && (
            <div className="mt-6 border-t border-slate-100 pt-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900">Store Profile Setup</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-xl bg-slate-50 p-5 border border-slate-100">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Store Name
                  </label>
                  <input
                    type="text"
                    {...register('storeName')}
                    placeholder="Enter store commercial name..."
                    className={`mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.storeName ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.storeName && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.storeName.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Store Email Address
                  </label>
                  <input
                    type="email"
                    {...register('storeEmail')}
                    placeholder="store@example.com"
                    className={`mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.storeEmail ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.storeEmail && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.storeEmail.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Store Business Address
                  </label>
                  <textarea
                    {...register('storeAddress')}
                    placeholder="Enter business commercial location..."
                    rows={2}
                    className={`mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.storeAddress ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.storeAddress && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.storeAddress.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? 'Creating Account...' : 'Create User Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUser;
