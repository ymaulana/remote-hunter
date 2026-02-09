/**
 * Date formatting utilities that are safe for SSR/hydration
 *
 * These functions prevent hydration mismatches by ensuring consistent
 * formatting between server and client renders.
 */

/**
 * Format a date string to a locale-aware date string
 * Uses suppressHydrationWarning to prevent hydration mismatches
 *
 * @param dateString - ISO date string
 * @param locale - Locale to use for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  locale: string = "en-US",
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 *
 * @param dateString - ISO date string
 * @returns Relative time string
 */

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  if (diffInWeeks < 4)
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  if (diffInMonths < 12)
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}

/**
 * Format a date to ISO string (YYYY-MM-DD)
 * This is safe for SSR as it doesn't depend on locale
 *
 * @param dateString - ISO date string
 * @returns ISO formatted date string
 */
export function formatISODate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}
