import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import SortableTable from '../../components/SortableTable';
import type { Column } from '../../components/SortableTable';
import FilterBar from '../../components/FilterBar';
import type { FilterField } from '../../components/FilterBar';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  created_at: string;
}

interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

const AdminUserList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'address' | 'role' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [filters, setFilters] = useState<Record<string, string>>({
    name: '',
    email: '',
    address: '',
    role: '',
  });

  const { data, isLoading } = useQuery<UserListResponse>({
    queryKey: ['adminUsers', page, sortBy, sortOrder, filters],
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
      const res = await api.get(`/users?${params.toString()}`);
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
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'normal_user', label: 'Normal User' },
      ],
    },
  ];

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'address', header: 'Address', sortable: true },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (row) => {
        const isSelfAdmin = row.role === 'admin';
        return (
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
              isSelfAdmin
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}
          >
            {row.role === 'admin' ? 'Admin' : 'Normal User'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Link
          to={`/admin/users/${row.id}`}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          View Detail
        </Link>
      ),
    },
  ];

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h2 className="font-display text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Users Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            List and search normal users and administrators
          </p>
        </div>
        <div>
          <Link
            to="/admin/users/new"
            className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
          >
            Add New User
          </Link>
        </div>
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
            of <span className="font-semibold text-slate-800">{data.total}</span> users
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

export default AdminUserList;
