import React, { useState } from 'react';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select';
  options?: { value: string; label: string }[];
}

interface FilterBarProps {
  filters: FilterField[];
  onFilter: (values: Record<string, string>) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilter }) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    filters.forEach((f) => {
      initial[f.key] = '';
    });
    return initial;
  });

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(values);
  };

  const handleClear = () => {
    const cleared: Record<string, string> = {};
    filters.forEach((f) => {
      cleared[f.key] = '';
    });
    setValues(cleared);
    onFilter(cleared);
  };

  return (
    <form onSubmit={handleApply} className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filters.map((f) => (
          <div key={f.key} className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500">{f.label}</label>
            {f.type === 'text' ? (
              <input
                type="text"
                value={values[f.key] || ''}
                onChange={(e) => handleChange(f.key, e.target.value)}
                placeholder={`Filter by ${f.label.toLowerCase()}...`}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
              />
            ) : (
              <select
                value={values[f.key] || ''}
                onChange={(e) => handleChange(f.key, e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="">All</option>
                {f.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-100 transition-colors cursor-pointer"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default FilterBar;
