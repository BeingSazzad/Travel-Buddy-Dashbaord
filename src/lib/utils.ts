export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatEur(value: number) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
}

export function labelize(value: string | null | undefined) {
  const text = String(value ?? '').replace(/_/g, ' ').trim()
  if (!text) return '—'
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function audienceLabel(value: string) {
  if (value === 'all') return 'All members'
  if (value === 'subscribers') return 'Subscribers'
  if (value === 'admins') return 'Admins'
  return labelize(value)
}

export function venueKindLabel(kind: string) {
  if (kind === 'cafe') return 'Café'
  return labelize(kind)
}

export function formatDisplayDate(value: string) {
  if (!value) return '—'
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) {
    const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
    if (Number.isFinite(date.getTime())) {
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }
  }
  return value
}

export function exportToCsv<T extends Record<string, unknown>>(filename: string, data: T[]) {
  if (!data || data.length === 0) return
  const headers = Object.keys(data[0])
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const val = row[header]
        const escaped = String(val ?? '').replace(/"/g, '""')
        return `"${escaped}"`
      })
      .join(',')
  )
  const csvContent = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
