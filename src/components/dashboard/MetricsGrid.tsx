import { KpiCard } from '@/components/ui/KpiCard'
import { formatEur } from '@/lib/utils'
import type { DashboardMetrics } from '@/services/endpoints/metricsApi'

export function MetricsGrid({ data }: { data: DashboardMetrics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Members" value={String(data.users)} delta={data.usersDelta} hint="vs last month" spark={data.sparkUsers} />
      <KpiCard label="Active trips" value={String(data.trips)} delta={data.tripsDelta} spark={data.sparkTrips} />
      <KpiCard label="Active events" value={String(data.events)} delta={data.eventsDelta} spark={data.sparkEvents} />
      <KpiCard label="Subscribers" value={String(data.subscribers)} delta={data.paidDelta} hint={`${formatEur(data.mrr)} MRR`} spark={data.sparkPaid} />
    </div>
  )
}
