import { PageHeader } from '@/components/layout/PageHeader'
import { DealsTable } from '@/components/deals/DealsTable'

export function DealsPage() {
  return (
    <div>
      <PageHeader title="Deals" description="Partner offers members can redeem." />
      <DealsTable />
    </div>
  )
}
