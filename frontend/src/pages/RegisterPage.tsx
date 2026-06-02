import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useToast } from '../contexts/ToastContext';

const registerSchema = z.object({
  name: z
    .string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name cannot exceed 60 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(400, 'Address cannot exceed 400 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password cannot exceed 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await api.post('/auth/register', data);
      showToast('Registration successful! Please sign in.', 'success');
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      setApiError(Array.isArray(msg) ? msg[0] : msg);
      showToast('Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join us to start reviewing stores
          </p>
        </div>

        {apiError && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
            {apiError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Full Name (Min 20 characters)
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="Johnathan Doe Placeholder Name"
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.name
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Address (Max 400 characters)
              </label>
              <textarea
                {...register('address')}
                placeholder="Enter your complete address..."
                rows={3}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.address
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Password (8-16 chars, 1 Upper, 1 Special)
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.password
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
