import { PageHeader } from '@/components/layout/PageHeader'
import { VenuesTable } from '@/components/content/VenuesTable'

export function ContentPage() {
  return (
    <div>
      <PageHeader title="Content" description="Cafés, restaurants, and hotels shown in the app." />
      <VenuesTable />
    </div>
  )
}
