/**
 * Format a date to YYYY-MM-DD using local timezone
 * This ensures consistency between frontend and backend date comparisons
 */
export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format using local timezone
 */
export const getTodayString = (): string => {
  return formatLocalDate(new Date());
};
