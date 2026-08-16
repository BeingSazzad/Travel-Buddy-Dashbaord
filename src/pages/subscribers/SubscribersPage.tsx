import { PageHeader } from '@/components/layout/PageHeader'
import { SubscribersTable } from '@/components/subscriptions/SubscribersTable'

export function SubscribersPage() {
  return (
    <div>
      <PageHeader
        title="Subscribers"
        description="Members on a plan. Edit the plans themselves under Subscriptions."
      />
      <SubscribersTable />
    </div>
  )
}
