import { PageHeader } from '@/components/layout/PageHeader'
import { ReportsTable } from '@/components/reports/ReportsTable'

export function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Safety flags from the community." />
      <ReportsTable />
    </div>
  )
}
