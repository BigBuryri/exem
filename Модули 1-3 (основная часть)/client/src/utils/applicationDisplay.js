export function getFieldLabel(config, key) {
  const field = config.application?.fields?.find((f) => f.name === key)
  if (field) return field.label
  const labels = {
    roomType: 'Помещение',
    startDate: 'Дата начала',
    paymentMethod: 'Оплата',
    status: 'Статус',
    adminComment: 'Комментарий',
    rating: 'Оценка',
  }
  return labels[key] || key
}

export function getStatusBadgeClass(color) {
  const map = {
    blue: 'badge bg-banquet-peach text-banquet-ink',
    yellow: 'badge bg-banquet-gold/30 text-banquet-ink',
    green: 'badge bg-banquet-green/15 text-banquet-green',
  }
  return map[color] || map.blue
}

export function formatFieldValue(config, key, value) {
  if (value == null || value === '') return '—'

  const field = config.application?.fields?.find((f) => f.name === key)
  if (field?.type === 'select' && field.options) {
    const opt = field.options.find((o) => o.value === value)
    if (opt) return opt.label
  }

  if (key === 'status' && config.application?.statuses?.[value]) {
    return config.application.statuses[value].label
  }

  return String(value)
}
