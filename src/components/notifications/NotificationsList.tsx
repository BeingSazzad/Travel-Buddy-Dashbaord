import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/Button'
import { formatDisplayDate } from '@/lib/utils'
import { useGetNotificationsQuery, useMarkReadMutation } from '@/services/endpoints/notificationsApi'

export function NotificationsList() {
  const { data = [] } = useGetNotificationsQuery()
  const [markRead] = useMarkReadMutation()

  return (
    <div className="space-y-3">
      {data.map((n) => (
        <Card key={n.id} className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-ink">{n.title}</p>
              <Badge tone={n.read ? 'neutral' : 'info'}>{n.read ? 'Read' : 'New'}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">{n.body}</p>
            <p className="mt-2 text-xs text-muted">
              {n.audience} · {formatDisplayDate(n.sentAt)}
            </p>
          </div>
          {!n.read ? (
            <Button variant="secondary" size="sm" onClick={() => markRead(n.id)}>
              Mark read
            </Button>
          ) : null}
        </Card>
      ))}
    </div>
  )
}
