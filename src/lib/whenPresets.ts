export type WhenPreset = 'all' | 'this_week' | 'this_month' | 'later' | 'now' | 'past'

export const EVENT_WHEN_OPTIONS = [
  { value: 'all', label: 'Any time' },
  { value: 'this_week', label: 'This week' },
  { value: 'this_month', label: 'This month' },
  { value: 'later', label: 'Later' },
  { value: 'past', label: 'Past' },
]

export const TRIP_WHEN_OPTIONS = [
  { value: 'all', label: 'Any time' },
  { value: 'now', label: 'Happening now' },
  { value: 'this_month', label: 'This month' },
  { value: 'later', label: 'Departing later' },
  { value: 'past', label: 'Already ended' },
]

function day(iso: string) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function startOfWeek(d: Date) {
  const copy = startOfDay(d)
  const weekday = copy.getDay()
  copy.setDate(copy.getDate() - weekday)
  return copy
}

function endOfWeek(d: Date) {
  const copy = startOfWeek(d)
  copy.setDate(copy.getDate() + 6)
  return copy
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

/** Single-date rows such as events. */
export function matchesWhen(iso: string, preset: WhenPreset, now = new Date()) {
  if (preset === 'all') return true
  const date = day(iso)
  if (!date) return true
  const today = startOfDay(now)
  if (preset === 'past') return date < today
  if (preset === 'this_week') return date >= startOfWeek(now) && date <= endOfWeek(now)
  if (preset === 'this_month') return date >= startOfMonth(now) && date <= endOfMonth(now)
  if (preset === 'later') return date > endOfMonth(now)
  if (preset === 'now') return date.getTime() === today.getTime()
  return true
}

/** Date-range rows such as trips. */
export function matchesRange(startIso: string, endIso: string, preset: WhenPreset, now = new Date()) {
  if (preset === 'all') return true
  const start = day(startIso)
  const end = day(endIso) ?? start
  if (!start || !end) return true
  const today = startOfDay(now)
  if (preset === 'now') return start <= today && end >= today
  if (preset === 'past') return end < today
  if (preset === 'this_week') return start <= endOfWeek(now) && end >= startOfWeek(now)
  if (preset === 'this_month') return start <= endOfMonth(now) && end >= startOfMonth(now)
  if (preset === 'later') return start > endOfMonth(now)
  return true
}
