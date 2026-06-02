import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import SortableTable from '../../components/SortableTable';
import type { Column } from '../../components/SortableTable';
import FilterBar from '../../components/FilterBar';
import type { FilterField } from '../../components/FilterBar';
import StarRating from '../../components/StarRating';

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  avgRating: number | null;
}

interface StoreListResponse {
  data: Store[];
  total: number;
  page: number;
  limit: number;
}

const AdminStoreList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'address' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [filters, setFilters] = useState<Record<string, string>>({
    name: '',
    email: '',
    address: '',
  });

  const { data, isLoading } = useQuery<StoreListResponse>({
    queryKey: ['adminStores', page, sortBy, sortOrder, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        ),
      });
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

  const handleFilter = (values: Record<string, string>) => {
    setFilters(values);
    setPage(1); // Reset page to 1
  };

  const filterFields: FilterField[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
  ];

  const columns: Column<Store>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'address', header: 'Address', sortable: true },
    {
      key: 'rating',
      header: 'Avg Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <StarRating readOnly value={row.avgRating} />
          <span className="text-xs font-semibold text-slate-500">
            {row.avgRating !== null ? `${row.avgRating} / 5` : 'No ratings'}
          </span>
        </div>
      ),
    },
  ];

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Stores Management
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          List and search registered stores along with overall ratings
        </p>
      </div>

      <FilterBar filters={filterFields} onFilter={handleFilter} />

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
    </div>
  );
};

export default AdminStoreList;
