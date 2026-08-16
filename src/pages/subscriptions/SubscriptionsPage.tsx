import { PageHeader } from '@/components/layout/PageHeader'
import { PlansBoard } from '@/components/subscriptions/PlansBoard'

export function SubscriptionsPage() {
  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="Plans for sale. People on a plan live under Subscribers."
      />
      <PlansBoard />
    </div>
  )
}
