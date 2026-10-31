import React from 'react';

/**
 * StatusBadge
 *
 * Renders a coloured pill badge with a dot indicator for the given status.
 *
 * Supported status values (case-insensitive):
 *  - "New"         → blue
 *  - "In Progress" → amber
 *  - "Resolved"    → emerald/green
 *
 * Props:
 *  - status : string  (required)
 */

const STATUS_CONFIG = {
  new: {
    dot: 'bg-blue-500',
    pill: 'bg-blue-50 text-blue-700 ring-blue-200',
    label: 'New',
  },
  'in progress': {
    dot: 'bg-amber-500',
    pill: 'bg-amber-50 text-amber-700 ring-amber-200',
    label: 'In Progress',
  },
  resolved: {
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    label: 'Resolved',
  },
};

/** Fallback for unknown statuses */
const FALLBACK_CONFIG = {
  dot: 'bg-slate-400',
  pill: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export default function StatusBadge({ status }) {
  const key = (status ?? '').toLowerCase().trim();
  const config = STATUS_CONFIG[key] ?? { ...FALLBACK_CONFIG, label: status };

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5',
        'px-2.5 py-0.5 rounded-full text-xs font-medium',
        'ring-1 ring-inset',
        config.pill,
      ].join(' ')}
    >
      <span
        className={['h-1.5 w-1.5 rounded-full flex-shrink-0', config.dot].join(' ')}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
