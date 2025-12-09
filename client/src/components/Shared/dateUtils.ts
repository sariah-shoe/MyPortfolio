// Helper so that my dates all look pretty

// Format dates in the form month year
function formatMonthYear(dateString?: string | null): string | null {
  // Ensure that I have a date string and it can be converted to a date object
  if (!dateString) return null;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  // Create a date string with just the month and year
  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// Format a range of dates
export function formatExperienceRange(
  startDate?: string | null,
  endDate?: string | null,
  personal?: boolean
): string {
  // Format start and end date
  const start = formatMonthYear(startDate);
  const end = formatMonthYear(endDate);

  // Remove impossible/invalid dates
  if (!start && !end) return "";
  if (!start && end) return end;

  if(personal) return start ?? "";

  // If there's no end date, return start - present
  if (start && !end) return `${start} to present`;

  // If it's the same month year, just return start
  if (start === end) return start ?? "";

  // Otherwise do a range from start to end
  return `${start} to ${end}`;
}