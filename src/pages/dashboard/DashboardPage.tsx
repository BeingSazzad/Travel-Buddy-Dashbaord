import { PageHeader } from '@/components/layout/PageHeader'
import { MetricsGrid } from '@/components/dashboard/MetricsGrid'
import { OverviewCharts } from '@/components/dashboard/OverviewCharts'
import { QueueBoard } from '@/components/dashboard/QueueBoard'
import { useGetDashboardMetricsQuery } from '@/services/endpoints/metricsApi'

export function DashboardPage() {
  const { data } = useGetDashboardMetricsQuery()
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Live snapshot of the Seluna community."
      />
      {data ? (
        <>
          <MetricsGrid data={data} />
          <OverviewCharts data={data} />
        </>
      ) : (
        <p className="text-sm text-muted">Loading metrics…</p>
      )}
      <div className="mt-7">
        <QueueBoard />
      </div>
    </div>
  )
}
