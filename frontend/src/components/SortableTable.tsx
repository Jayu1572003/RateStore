import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface SortableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string) => void;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  isLoading?: boolean;
}

const SortableTable = <T extends { id: string }>({
  columns,
  data,
  onSort,
  sortBy,
  sortOrder,
  isLoading = false,
}: SortableTableProps<T>) => {
  const handleSortClick = (key: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(key);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => {
              const isActive = sortBy === col.key;
              return (
                <th
                  key={col.key}
                  onClick={() => handleSortClick(col.key, col.sortable)}
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                    col.sortable ? 'cursor-pointer select-none hover:bg-slate-100 hover:text-slate-700' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="inline-block text-slate-400">
                        {isActive ? (
                          sortOrder === 'ASC' ? (
                            <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3l8 8h-6v10h-4v-10h-6z" />
                            </svg>
                          ) : (
                            <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21l-8-8h6v-10h4v10h6z" />
                            </svg>
                          )
                        ) : (
                          <svg className="h-3 w-3 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3l8 8h-6v10h-4v-10h-6z M12 21l-8-8h6v-10h4v10h6z" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    <div className="h-4 rounded bg-slate-200" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={row.id || rowIdx} className="hover:bg-slate-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-slate-700">
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
