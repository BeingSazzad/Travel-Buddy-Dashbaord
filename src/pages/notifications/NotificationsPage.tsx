import { PageHeader } from '@/components/layout/PageHeader'
import { NotificationsList } from '@/components/notifications/NotificationsList'

export function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" description="Alerts for this admin — not the member app inbox." />
      <NotificationsList />
    </div>
  )
}
