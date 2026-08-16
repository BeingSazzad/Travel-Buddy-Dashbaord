import { PageHeader } from '@/components/layout/PageHeader'
import { TripsTable } from '@/components/trips/TripsTable'

export function TripsPage() {
  return (
    <div>
      <PageHeader title="Trips" description="Public and hidden trips members are hosting." />
      <TripsTable />
    </div>
  )
}
