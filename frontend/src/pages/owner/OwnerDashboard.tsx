import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';
import SortableTable from '../../components/SortableTable';
import type { Column } from '../../components/SortableTable';

interface Rater {
  userId: string;
  userName: string;
  userEmail: string;
  ratingValue: number;
  ratedAt: string;
}

interface OwnerDashboardData {
  store: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
  avgRating: number | null;
  raters: Rater[];
}

const OwnerDashboard: React.FC = () => {
  const [sortBy, setSortBy] = useState<'userName' | 'userEmail' | 'ratingValue' | 'ratedAt'>('ratedAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const { data, isLoading, error } = useQuery<OwnerDashboardData>({
    queryKey: ['ownerDashboard'],
    queryFn: async () => {
      const res = await api.get('/stores/owner/dashboard');
      return res.data;
    },
  });

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(key as any);
      setSortOrder('ASC');
    }
  };

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
        Failed to load store owner dashboard data. Ensure your user account is assigned to a store.
      </div>
    );
  }

  // Client-side sort logic for raters array
  const sortedRaters = [...data.raters].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'ratedAt') {
      valA = new Date(a.ratedAt).getTime();
      valB = new Date(b.ratedAt).getTime();
    }

    if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
    if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
    return 0;
  });

  const columns: Column<Rater>[] = [
    { key: 'userName', header: 'User Name', sortable: true },
    { key: 'userEmail', header: 'User Email', sortable: true },
    {
      key: 'ratingValue',
      header: 'Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-1">
          <StarRating readOnly value={row.ratingValue} />
          <span className="text-xs font-semibold text-slate-500">({row.ratingValue})</span>
        </div>
      ),
    },
    {
      key: 'ratedAt',
      header: 'Date Rated',
      sortable: true,
      render: (row) => (
        <span className="text-slate-500">
          {new Date(row.ratedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
  ];

  // Map each rater to have a unique ID for SortableTable key assignment
  const tableData = sortedRaters.map((r) => ({
    ...r,
    id: r.userId, // required by SortableTable
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Store Owner Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          View visitor reviews and performance analytics
        </p>
      </div>

      {/* Top Section: Store Info & Average Rating */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Store Profile
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Name</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{data.store.name}</p>
            </div>
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Email</p>
              <p className="text-sm font-medium text-slate-800 mt-1">{data.store.email}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Business Address</p>
              <p className="text-sm text-slate-800 mt-1 break-words">{data.store.address}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Rating</p>
          <h2 className="font-display text-4xl font-extrabold text-slate-800 mt-2">
            {data.avgRating !== null ? data.avgRating.toFixed(1) : '—'}
          </h2>
          <div className="mt-3">
            <StarRating readOnly value={data.avgRating} />
          </div>
          <p className="text-xs font-medium text-slate-500 mt-2">
            {data.raters.length} {data.raters.length === 1 ? 'rating' : 'ratings'} in total
          </p>
        </div>
      </div>

      {/* Bottom Section: Reviews list */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Customer Reviews</h3>
        <SortableTable
          columns={columns}
          data={tableData}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </div>
    </div>
  );
};

export default OwnerDashboard;
