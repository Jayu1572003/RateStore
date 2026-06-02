import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'admin' | 'normal_user' | 'store_owner';
  created_at: string;
  store?: {
    id: string;
    name: string;
    email: string;
    address: string;
    avgRating: number | null;
  } | null;
}

const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<UserDetail>({
    queryKey: ['adminUserDetail', id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg mt-12 p-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-center text-sm font-medium">
        Failed to load user details. They may not exist.
      </div>
    );
  }

  const formatRole = (role: string) => {
    return role
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'store_owner':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">{data.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">User Profile Overview</p>
          </div>
          <div>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(
                data.role
              )}`}
            >
              {formatRole(data.role)}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </h4>
              <p className="text-sm text-slate-800 font-medium mt-1">{data.email}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Member Since
              </h4>
              <p className="text-sm text-slate-800 font-medium mt-1">
                {new Date(data.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="sm:col-span-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Address
              </h4>
              <p className="text-sm text-slate-800 font-medium mt-1 break-words">{data.address}</p>
            </div>
          </div>

          {/* Conditional store owner info */}
          {data.role === 'store_owner' && data.store && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Store Details</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 rounded-xl bg-slate-50 p-6 border border-slate-100">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Store Name
                  </h4>
                  <p className="text-sm text-slate-800 font-semibold mt-1">{data.store.name}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Store Email
                  </h4>
                  <p className="text-sm text-slate-800 font-medium mt-1">{data.store.email}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Average Rating
                  </h4>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <StarRating readOnly value={data.store.avgRating} />
                    <span className="text-sm font-semibold text-slate-700">
                      {data.store.avgRating !== null ? `${data.store.avgRating} / 5` : 'No ratings'}
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Store Address
                  </h4>
                  <p className="text-sm text-slate-800 font-medium mt-1 break-words">
                    {data.store.address}
                  </p>
                </div>
              </div>
            </div>
          )}

          {data.role === 'store_owner' && !data.store && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 font-medium text-center">
                This store owner does not currently have a store profile configured.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
