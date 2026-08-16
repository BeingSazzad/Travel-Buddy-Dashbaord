import { PageHeader } from '@/components/layout/PageHeader'
import { DestinationsTable } from '@/components/destinations/DestinationsTable'

export function DestinationsPage() {
  return (
    <div>
      <PageHeader title="Destinations" description="Cities travellers are heading to." />
      <DestinationsTable />
    </div>
  )
}
