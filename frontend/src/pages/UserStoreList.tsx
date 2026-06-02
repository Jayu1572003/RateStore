import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import SortableTable from '../components/SortableTable';
import type { Column } from '../components/SortableTable';
import StarRating from '../components/StarRating';
import RatingModal from '../components/RatingModal';

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  avgRating: number | null;
  userRating: number | null;
}

interface StoreListResponse {
  data: Store[];
  total: number;
  page: number;
  limit: number;
}

const UserStoreList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'address' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Rating Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    storeId: string;
    storeName: string;
    existingRating: number | null;
  }>({
    isOpen: false,
    storeId: '',
    storeName: '',
    existingRating: null,
  });

  const { data, isLoading, refetch } = useQuery<StoreListResponse>({
    queryKey: ['userStores', page, sortBy, sortOrder, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      const res = await api.get(`/stores?${params.toString()}`);
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

  const openRatingModal = (store: Store) => {
    setModalState({
      isOpen: true,
      storeId: store.id,
      storeName: store.name,
      existingRating: store.userRating,
    });
  };

  const closeRatingModal = () => {
    setModalState({
      isOpen: false,
      storeId: '',
      storeName: '',
      existingRating: null,
    });
  };

  const columns: Column<Store>[] = [
    { key: 'name', header: 'Store Name', sortable: true },
    { key: 'address', header: 'Address', sortable: true },
    {
      key: 'rating',
      header: 'Overall Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <StarRating readOnly value={row.avgRating} />
          <span className="text-sm font-semibold text-slate-600">
            {row.avgRating !== null ? `${row.avgRating} / 5` : 'No ratings'}
          </span>
        </div>
      ),
    },
    {
      key: 'userRating',
      header: 'Your Rating',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.userRating !== null ? (
            <>
              <StarRating readOnly value={row.userRating} />
              <span className="text-xs font-semibold text-blue-600">({row.userRating} / 5)</span>
            </>
          ) : (
            <span className="text-xs italic text-slate-400">Not yet rated</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => openRatingModal(row)}
          className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer border-none ${
            row.userRating !== null
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {row.userRating !== null ? 'Edit Rating' : 'Rate Store'}
        </button>
      ),
    },
  ];

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="font-display text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Explore Stores
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Find stores, check overall visitor ratings, and submit your review
          </p>
        </div>
        <div className="w-full max-w-xs">
          <label className="sr-only">Search</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or address..."
              className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors shadow-xs"
            />
          </div>
        </div>
      </div>

      <SortableTable
        columns={columns}
        data={data?.data || []}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        isLoading={isLoading}
      />

      {/* Pagination Controls */}
      {data && data.total > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6">
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-800">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(page * limit, data.total)}
            </span>{' '}
            of <span className="font-semibold text-slate-800">{data.total}</span> stores
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Rating Dialog Modal */}
      {modalState.isOpen && (
        <RatingModal
          storeId={modalState.storeId}
          storeName={modalState.storeName}
          existingRating={modalState.existingRating}
          onSuccess={refetch}
          onClose={closeRatingModal}
        />
      )}
    </div>
  );
};

export default UserStoreList;
