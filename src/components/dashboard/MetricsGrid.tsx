import { KpiCard } from '@/components/ui/KpiCard'
import { formatUsd } from '@/lib/utils'
import type { DashboardMetrics } from '@/services/endpoints/metricsApi'

export function MetricsGrid({ data }: { data: DashboardMetrics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Members" value={String(data.users)} delta={12} hint="vs last month" spark={data.sparkUsers} />
      <KpiCard label="Active trips" value={String(data.trips)} delta={8} spark={data.sparkTrips} />
      <KpiCard label="Subscribers" value={String(data.subscribers)} hint={`${formatUsd(data.mrr)} MRR`} />
      <KpiCard label="Pending reports" value={String(data.reports)} delta={data.reports ? -4 : 0} />
    </div>
  )
}
