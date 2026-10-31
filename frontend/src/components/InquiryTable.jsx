import React from 'react';
import { Eye, ChevronLeft, ChevronRight, AlertCircle, InboxIcon } from 'lucide-react';

// ─── Helper: Avatar initials ──────────────────────────────────────────────────
function Initials({ name }) {
  const parts = (name || 'U').trim().split(/\s+/);
  const text =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center text-xs font-bold flex-shrink-0 select-none">
      {text}
    </div>
  );
}

// ─── Helper: Status badge ─────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    New:          'bg-blue-50   text-blue-700   border-blue-200',
    'In Progress': 'bg-amber-50  text-amber-700  border-amber-200',
    Resolved:     'bg-green-50  text-green-700  border-green-200',
  };
  const cls = map[status] || 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {status || '—'}
    </span>
  );
}

// ─── Helper: User type badge ──────────────────────────────────────────────────
function UserTypeBadge({ type }) {
  const map = {
    Parent:  'bg-purple-50 text-purple-700 border-purple-200',
    Student: 'bg-cyan-50   text-cyan-700   border-cyan-200',
    School:  'bg-teal-50   text-teal-700   border-teal-200',
  };
  const cls = map[type] || 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {type || '—'}
    </span>
  );
}

// ─── Helper: Category badge ───────────────────────────────────────────────────
function CategoryBadge({ category }) {
  const map = {
    Scholarship:   'bg-indigo-50 text-indigo-700 border-indigo-200',
    Concert:       'bg-pink-50   text-pink-700   border-pink-200',
    Admission:     'bg-orange-50 text-orange-700 border-orange-200',
    'General Query': 'bg-slate-50  text-slate-600  border-slate-200',
  };
  const cls = map[category] || 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {category || '—'}
    </span>
  );
}

// ─── Helper: Format date ──────────────────────────────────────────────────────
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: `${60 + (i % 3) * 15}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Mobile card skeleton ─────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-slate-200 rounded w-2/3" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-slate-200 rounded w-4/5" />
      <div className="h-3 bg-slate-200 rounded w-3/5" />
    </div>
  );
}

// ─── Mobile Card (one inquiry) ────────────────────────────────────────────────
function InquiryCard({ inquiry, onStatusUpdate, onViewDetail }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Initials name={inquiry.name} />
          <div>
            <p className="font-semibold text-[#1E293B] text-sm">{inquiry.name || '—'}</p>
            <p className="text-slate-500 text-xs">{inquiry.phone || '—'}</p>
          </div>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <UserTypeBadge type={inquiry.user_type || inquiry.userType} />
        <CategoryBadge category={inquiry.category} />
      </div>

      {/* Email & Date */}
      <div className="text-xs text-slate-500 space-y-0.5">
        <p className="truncate">{inquiry.email || '—'}</p>
        <p>{fmtDate(inquiry.created_at || inquiry.createdAt)}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onViewDetail?.(inquiry)}
          className="flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] border border-[#BFDBFE] hover:border-[#2563EB] rounded-lg px-3 py-1.5 transition-colors"
        >
          <Eye style={{ width: '0.875rem', height: '0.875rem' }} />
          View
        </button>
        <select
          value={inquiry.status || 'New'}
          onChange={(e) => onStatusUpdate?.(inquiry._id || inquiry.id, e.target.value)}
          className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>
    </div>
  );
}

// ─── Main InquiryTable component ──────────────────────────────────────────────
/**
 * Props:
 *   inquiries    – array of inquiry objects
 *   isLoading    – bool
 *   error        – string | null
 *   pagination   – { total, page, limit, totalPages }
 *   onPageChange – (newPage) => void
 *   onStatusUpdate – (id, newStatus) => void
 *   onViewDetail – (inquiry) => void
 */
export default function InquiryTable({
  inquiries = [],
  isLoading = false,
  error = null,
  pagination = {},
  onPageChange,
  onStatusUpdate,
  onViewDetail,
}) {
  const { total = 0, page = 1, limit = 10, totalPages = 1 } = pagination;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Desktop Table ── */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200">
                {['Name', 'Phone', 'Email', 'User Type', 'Category', 'Date', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <InboxIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-600">No inquiries found</p>
                        <p className="text-sm mt-0.5">Try adjusting your filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => {
                  const id = inq._id || inq.id;
                  return (
                    <tr key={id} className="hover:bg-[#F8FAFC] transition-colors">
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Initials name={inq.name} />
                          <span className="font-medium text-[#1E293B] whitespace-nowrap">{inq.name || '—'}</span>
                        </div>
                      </td>
                      {/* Phone */}
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{inq.phone || '—'}</td>
                      {/* Email */}
                      <td className="px-4 py-3">
                        <span
                          className="text-slate-600 max-w-[160px] inline-block truncate"
                          title={inq.email}
                        >
                          {inq.email || '—'}
                        </span>
                      </td>
                      {/* User Type */}
                      <td className="px-4 py-3">
                        <UserTypeBadge type={inq.user_type || inq.userType} />
                      </td>
                      {/* Category */}
                      <td className="px-4 py-3">
                        <CategoryBadge category={inq.category} />
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                        {fmtDate(inq.created_at || inq.createdAt)}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={inq.status} />
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewDetail?.(inq)}
                            className="flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] border border-[#BFDBFE] hover:border-[#2563EB] rounded-lg px-2.5 py-1.5 transition-colors whitespace-nowrap"
                          >
                            <Eye style={{ width: '0.8125rem', height: '0.8125rem' }} />
                            View
                          </button>
                          <select
                            value={inq.status || 'New'}
                            onChange={(e) => onStatusUpdate?.(id, e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        ) : inquiries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-slate-400">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <InboxIcon className="w-7 h-7" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-600">No inquiries found</p>
              <p className="text-sm mt-0.5">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          inquiries.map((inq) => (
            <InquiryCard
              key={inq._id || inq.id}
              inquiry={inq}
              onStatusUpdate={onStatusUpdate}
              onViewDetail={onViewDetail}
            />
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {!isLoading && total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-[#1E293B]">{start}</span>–
            <span className="font-semibold text-[#1E293B]">{end}</span> of{' '}
            <span className="font-semibold text-[#1E293B]">{total}</span> inquiries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft style={{ width: '1rem', height: '1rem' }} />
              Previous
            </button>
            <span className="text-sm font-medium text-[#1E293B] px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
