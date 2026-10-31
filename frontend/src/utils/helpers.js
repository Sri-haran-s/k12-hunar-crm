/**
 * helpers.js
 * Shared utility functions for the EduConnect CRM frontend.
 */

// ----------------------------------------------------------------
// formatDate
// ----------------------------------------------------------------
/**
 * Format an ISO date string (or Date object) to a human-readable string.
 *
 * @param {string|Date} dateString
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}  e.g. "Jan 15, 2024"
 */
export function formatDate(dateString, options) {
  if (!dateString) return '—';

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) return '—';

    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      ...options,
    });

    return formatter.format(date);
  } catch {
    return '—';
  }
}

// ----------------------------------------------------------------
// formatPhone
// ----------------------------------------------------------------
/**
 * Return the phone number as-is (already formatted by the server / form).
 *
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return '—';
  return phone;
}

// ----------------------------------------------------------------
// truncateText
// ----------------------------------------------------------------
/**
 * Truncate a string to maxLength characters and append an ellipsis if needed.
 *
 * @param {string} text
 * @param {number} [maxLength=80]
 * @returns {string}
 */
export function truncateText(text, maxLength = 80) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// ----------------------------------------------------------------
// classNames
// ----------------------------------------------------------------
/**
 * Merge class names, filtering out falsy values.
 * Useful for conditional Tailwind classes.
 *
 * @param {...(string|undefined|null|false)} classes
 * @returns {string}
 *
 * @example
 * classNames('btn', isActive && 'btn-primary', isDisabled && 'opacity-50')
 * // => "btn btn-primary" or "btn opacity-50"
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
