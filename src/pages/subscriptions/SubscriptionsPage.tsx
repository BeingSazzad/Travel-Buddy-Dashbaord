import { PageHeader } from '@/components/layout/PageHeader'
import { SubscriptionsTable } from '@/components/subscriptions/SubscriptionsTable'

export function SubscriptionsPage() {
  return (
    <div>
      <PageHeader title="Subscriptions" description="Paying members and renewal dates." />
      <SubscriptionsTable />
    </div>
  )
}
