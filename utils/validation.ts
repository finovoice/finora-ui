// Reusable validation utilities for the app

export const isValidDate = (dateStr: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateStr)) return false

  const [yearStr, monthStr, dayStr] = dateStr.split("-")
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)
  const day = parseInt(dayStr, 10)

  if (year < 1925 || year > 2007) return false
  if (month < 1 || month > 12) return false

  const daysInMonth = new Date(year, month, 0).getDate()
  return day >= 1 && day <= daysInMonth
}

export function isValidPositiveInteger(value: string): boolean {
  return /^[1-9]\d*$/.test(value.trim())
}

export const isValidPAN = (pan: string): boolean => {
  const pattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/
  return pattern.test(pan.trim().toUpperCase())
}
