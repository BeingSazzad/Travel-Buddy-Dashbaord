import { peopleStore } from '@/lib/peopleStore'
import { subscribersStore } from '@/lib/subscribersStore'
import { tripsStore } from '@/lib/tripsStore'
import { eventsStore } from '@/lib/eventsStore'

export const CHART_START_YEAR = 2025

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export type MonthPoint = {
  month: string
  members: number
  paid: number
  income: number
}

export type DashboardCharts = {
  users: number
  trips: number
  events: number
  subscribers: number
  mrr: number
  usersDelta: number
  tripsDelta: number
  eventsDelta: number
  paidDelta: number
  incomeDelta: number
  sparkUsers: number[]
  sparkTrips: number[]
  sparkEvents: number[]
  sparkPaid: number[]
  sparkIncome: number[]
  years: number[]
  byYear: Record<number, MonthPoint[]>
}

function hash01(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function pctDelta(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

function chartYears() {
  const now = new Date().getFullYear()
  const end = Math.max(now, CHART_START_YEAR)
  return Array.from({ length: end - CHART_START_YEAR + 1 }, (_, i) => CHART_START_YEAR + i)
}

function buildYearlySeries(years: number[]) {
  let members = 36
  let paid = 11
  const byYear: Record<number, MonthPoint[]> = {}
  for (const year of years) {
    byYear[year] = MONTHS.map((month, m) => {
      const membersNew = Math.round(8 + hash01(year * 24 + m) * 18 + (year - CHART_START_YEAR) * 6 + m * 0.7)
      const paidNew = Math.round(3 + hash01(year * 24 + m + 7) * 7 + (year - CHART_START_YEAR) * 2.2 + m * 0.22)
      members += membersNew
      paid += paidNew
      const income = Math.round(420 + hash01(year * 12 + m + 3) * 680 + m * 42 + (year - CHART_START_YEAR) * 480 + paidNew * 18)
      return { month, members, paid, income }
    })
  }
  return byYear
}

export function buildDashboardCharts(): DashboardCharts {
  const people = peopleStore.list()
  const subs = subscribersStore.active()
  const years = chartYears()
  const byYear = buildYearlySeries(years)
  const current = byYear[years[years.length - 1]] ?? []
  const income = current.map((row) => row.income)
  const lastIncome = income.slice(-1)[0] ?? 0
  const prevIncome = income.slice(-2, -1)[0] ?? 0
  const membersNow = current.at(-1)?.members ?? people.length
  const membersPrev = current.length > 1 ? current[current.length - 2].members : membersNow
  const paidNow = current.at(-1)?.paid ?? subs.length
  const paidPrev = current.length > 1 ? current[current.length - 2].paid : paidNow
  const trips = tripsStore.list().length
  const events = eventsStore.list().filter((e) => e.status === 'upcoming' || e.status === 'live').length

  return {
    users: people.length,
    trips,
    events,
    subscribers: subs.length,
    mrr: Math.round(subscribersStore.mrr()),
    usersDelta: pctDelta(membersNow, membersPrev),
    tripsDelta: 8,
    eventsDelta: 6,
    paidDelta: pctDelta(paidNow, paidPrev),
    incomeDelta: pctDelta(lastIncome, prevIncome),
    sparkUsers: current.slice(-7).map((row) => row.members),
    sparkTrips: [2, 2, 3, 4, 4, 5, 5],
    sparkEvents: [1, 2, 2, 3, 3, 3, 4],
    sparkPaid: current.slice(-7).map((row) => row.paid),
    sparkIncome: income.slice(-7),
    years,
    byYear,
  }
}
