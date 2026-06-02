import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

const AdminDashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg mt-12 p-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-center text-sm font-medium">
        Failed to load dashboard statistics. Please try again.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Administrator Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Overview statistics and administrative actions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Users Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
              <h3 className="font-display text-3xl font-bold text-slate-800 mt-1">{data?.totalUsers}</h3>
            </div>
          </div>
        </div>

        {/* Stores Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Total Stores</p>
              <h3 className="font-display text-3xl font-bold text-slate-800 mt-1">{data?.totalStores}</h3>
            </div>
          </div>
        </div>

        {/* Ratings Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Total Ratings</p>
              <h3 className="font-display text-3xl font-bold text-slate-800 mt-1">{data?.totalRatings}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">Quick Admin Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link
            to="/admin/users"
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <span>Manage Users</span>
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/admin/stores"
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <span>Manage Stores</span>
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/admin/users/new"
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <span>Add New User / Owner</span>
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
