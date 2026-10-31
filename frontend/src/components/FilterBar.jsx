import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'Scholarship', label: 'Scholarship' },
  { value: 'Concert', label: 'Concert' },
  { value: 'Admission', label: 'Admission' },
  { value: 'General Query', label: 'General Query' },
];

const USER_TYPES = [
  { value: '', label: 'All Users' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Student', label: 'Student' },
  { value: 'School', label: 'School' },
];

/**
 * FilterBar
 * Props:
 *   filters       – { category: string, userType: string, search: string }
 *   onFilterChange – (key, value) => void
 *   onClear       – () => void
 */
export default function FilterBar({ filters = {}, onFilterChange, onClear }) {
  const { category = '', userType = '', search = '' } = filters;
  const hasActiveFilters = category !== '' || userType !== '' || search !== '';

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            style={{ width: '1rem', height: '1rem' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onFilterChange?.('search', e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-[#F8FAFC] text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Category dropdown */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => onFilterChange?.('category', e.target.value)}
              className="appearance-none w-full sm:w-44 pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-[#F8FAFC] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition cursor-pointer"
            >
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              style={{ width: '0.875rem', height: '0.875rem' }}
            />
          </div>

          {/* User Type dropdown */}
          <div className="relative">
            <select
              value={userType}
              onChange={(e) => onFilterChange?.('userType', e.target.value)}
              className="appearance-none w-full sm:w-36 pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-[#F8FAFC] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition cursor-pointer"
            >
              {USER_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              style={{ width: '0.875rem', height: '0.875rem' }}
            />
          </div>

          {/* Clear Filters button */}
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-colors duration-150 flex-shrink-0"
            >
              <X style={{ width: '0.875rem', height: '0.875rem' }} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
