const DATE_PATTERN = /^\d{2}\.\d{2}\.\d{4}$/

export function isValidRussianDate(value) {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value.trim())) {
    return false
  }

  const [dayStr, monthStr, yearStr] = value.trim().split('.')
  const day = Number(dayStr)
  const month = Number(monthStr)
  const year = Number(yearStr)

  if (month < 1 || month > 12 || day < 1 || year < 1900 || year > 2100) {
    return false
  }

  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export function validateRussianDate(value) {
  if (!value || !String(value).trim()) {
    return true
  }

  const trimmed = String(value).trim()
  if (!DATE_PATTERN.test(trimmed)) {
    return 'Формат: ДД.ММ.ГГГГ'
  }

  if (!isValidRussianDate(trimmed)) {
    return 'Укажите существующую дату'
  }

  return true
}
