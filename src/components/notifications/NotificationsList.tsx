import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/Button'
import { FilterBar } from '@/components/shared/FilterBar'
import { audienceLabel, formatDisplayDate } from '@/lib/utils'
import { useGetNotificationsQuery, useMarkAllReadMutation, useMarkReadMutation } from '@/services/endpoints/notificationsApi'

export function NotificationsList() {
  const { data = [] } = useGetNotificationsQuery()
  const [markRead] = useMarkReadMutation()
  const [markAll] = useMarkAllReadMutation()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const unread = data.filter((n) => !n.read).length
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return data.filter((n) => {
      if (status === 'unread' && n.read) return false
      if (status === 'read' && !n.read) return false
      if (!q) return true
      return `${n.title} ${n.body} ${n.audience}`.toLowerCase().includes(q)
    })
  }, [data, search, status])

  return (
    <Card padding={false}>
      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search notifications…"
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: status,
            onChange: setStatus,
            options: [
              { value: 'all', label: 'All' },
              { value: 'unread', label: 'Unread' },
              { value: 'read', label: 'Read' },
            ],
          },
        ]}
        extra={
          unread ? (
            <Button variant="secondary" size="sm" onClick={() => markAll()}>
              Mark all read
            </Button>
          ) : null
        }
      />
      {rows.length === 0 ? (
        <p className="px-6 py-16 text-center text-sm text-muted">No notifications match these filters.</p>
      ) : (
        <div className="divide-y divide-line">
          {rows.map((n) => (
            <div key={n.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4.5 transition-colors hover:bg-surface/50">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-semibold text-ink text-sm sm:text-base">{n.title}</p>
                  <div className="flex items-center gap-1.5">
                    <Badge tone={n.read ? 'neutral' : 'info'}>{n.read ? 'Read' : 'New'}</Badge>
                    <Badge tone="neutral">{audienceLabel(n.audience)}</Badge>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted line-clamp-2">{n.body}</p>
                <p className="mt-2 text-xs font-medium text-muted/80">{formatDisplayDate(n.sentAt)}</p>
              </div>
              {!n.read ? (
                <div className="shrink-0 self-start sm:self-center">
                  <Button variant="secondary" size="sm" onClick={() => markRead(n.id)}>
                    Mark as read
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
