import { PageHeader } from '@/components/layout/PageHeader'
import { NotificationsList } from '@/components/notifications/NotificationsList'

export function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" description="Admin alerts and community broadcasts." />
      <NotificationsList />
    </div>
  )
}
