export function getCurrentYear(): number {
  return new Date().getFullYear()
}

export function getPreviousYear(): number {
  return new Date().getFullYear() - 1
}

export function getYearBounds(year: number): { start: number; end: number } {
  // Start of year (Jan 1, 00:00:00) in epoch seconds
  const start = new Date(year, 0, 1, 0, 0, 0).getTime() / 1000

  // End of year (Jan 1 of next year, 00:00:00) in epoch seconds
  const end = new Date(year + 1, 0, 1, 0, 0, 0).getTime() / 1000

  return { start, end }
}

export function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[month - 1] ?? ""
}
