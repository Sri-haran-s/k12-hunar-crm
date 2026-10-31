import React from 'react';

/**
 * LoadingSpinner
 *
 * Props:
 *  - size     : 'sm' | 'md' | 'lg'  (default: 'md')
 *  - fullPage : boolean              (default: false) — centres spinner in the viewport
 *  - label    : string               (optional) — accessible screen-reader label
 */
const sizeMap = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export default function LoadingSpinner({
  size = 'md',
  fullPage = false,
  label = 'Loading…',
}) {
  const ringClasses = [
    'rounded-full',
    'border-blue-200',
    'border-t-blue-600',
    'animate-spin-ring',
    sizeMap[size] ?? sizeMap.md,
  ].join(' ');

  const spinner = (
    <div role="status" aria-label={label} className="flex flex-col items-center gap-3">
      <div className={ringClasses} />
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      {spinner}
    </div>
  );
}
