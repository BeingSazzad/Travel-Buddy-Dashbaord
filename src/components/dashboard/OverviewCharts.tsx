import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { SplitBarChart } from '@/components/ui/SplitBarChart'
import { AreaChart } from '@/components/ui/AreaChart'
import { Icon } from '@/components/ui/Icon'
import { cn, formatUsd } from '@/lib/utils'
import type { DashboardCharts } from '@/lib/dashboardCharts'

function Delta({ value }: { value: number }) {
  const up = value >= 0
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
      )}
    >
      <Icon name={up ? 'arrowUp' : 'arrowDown'} className="mr-0.5 h-3 w-3" />
      {Math.abs(value)}%
    </span>
  )
}

function axisUsd(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
  return `$${value}`
}

function monthDelta(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export function OverviewCharts({ data }: { data: DashboardCharts }) {
  const defaultYear = data.years[data.years.length - 1] ?? 2026
  const [year, setYear] = useState(String(defaultYear))
  const months = useMemo(() => {
    const rows = data.byYear[Number(year)] ?? []
    const now = new Date()
    if (Number(year) !== now.getFullYear()) return rows
    return rows.slice(0, now.getMonth() + 1)
  }, [data.byYear, year])
  const last = months.at(-1)
  const prev = months.length > 1 ? months[months.length - 2] : last
  const incomeTotal = months.reduce((sum, row) => sum + row.income, 0)
  const paidShare = last && last.members > 0 ? Math.round((last.paid / last.members) * 100) : 0
  const membersDelta = monthDelta(last?.members ?? 0, prev?.members ?? 0)
  const incomeDelta = monthDelta(last?.income ?? 0, prev?.income ?? 0)

  function YearSelect() {
    return (
      <div className="w-[108px] shrink-0">
        <Select
          aria-label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          options={data.years.map((y) => ({ value: String(y), label: String(y) }))}
          className="h-9"
        />
      </div>
    )
  }

  return (
    <div className="mt-7 grid gap-4 xl:grid-cols-2 xl:items-stretch">
      <Card className="flex flex-col">
        <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-sm font-semibold text-ink">User growth</h2>
            <p className="mt-0.5 text-xs text-muted">How the community compounds each month</p>
          </div>
          <YearSelect />
        </div>
        <div className="mb-4 mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-[26px] font-semibold leading-none tracking-tight tabular-nums">
              {(last?.members ?? 0).toLocaleString()}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Delta value={membersDelta} />
              <span className="text-xs text-muted">vs last month · {paidShare}% paid</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
              Members
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sidebar" />
              Paid
            </span>
          </div>
        </div>
        <SplitBarChart
          ariaLabel="Members vs paid subscribers by month"
          series={months.map((row) => ({
            label: row.month,
            left: row.members,
            right: row.paid,
          }))}
        />
      </Card>

      <Card className="flex flex-col">
        <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-sm font-semibold text-ink">Income</h2>
            <p className="mt-0.5 text-xs text-muted">
              {Number(year) === new Date().getFullYear()
                ? 'Subscription revenue year to date'
                : 'Subscription revenue collected this year'}
            </p>
          </div>
          <YearSelect />
        </div>
        <div className="mb-4 mt-3">
          <p className="font-display text-[26px] font-semibold leading-none tracking-tight tabular-nums">
            {formatUsd(incomeTotal)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Delta value={incomeDelta} />
            <span className="text-xs text-muted">
              vs last month · {formatUsd(last?.income ?? 0)} in {last?.month}
            </span>
          </div>
        </div>
        <AreaChart
          ariaLabel="Monthly subscription income"
          fillId="selunaIncomeFill"
          values={months.map((row) => row.income)}
          labels={months.map((row) => row.month)}
          formatY={axisUsd}
        />
      </Card>
    </div>
  )
}
