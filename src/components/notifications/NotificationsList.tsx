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
            <div key={n.id} className="flex items-start justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">{n.title}</p>
                  <Badge tone={n.read ? 'neutral' : 'info'}>{n.read ? 'Read' : 'New'}</Badge>
                  <Badge tone="neutral">{audienceLabel(n.audience)}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">{n.body}</p>
                <p className="mt-2 text-xs text-muted">{formatDisplayDate(n.sentAt)}</p>
              </div>
              {!n.read ? (
                <Button variant="secondary" size="sm" onClick={() => markRead(n.id)}>
                  Mark read
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
