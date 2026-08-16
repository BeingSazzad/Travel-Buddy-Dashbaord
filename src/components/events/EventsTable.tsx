import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { useTableState } from '@/hooks/useTableState'
import { formatDisplayDate } from '@/lib/utils'
import { useGetEventsQuery, useSetEventStatusMutation } from '@/services/endpoints/eventsApi'
import type { Meetup } from '@/lib/eventsStore'

function tone(s: Meetup['status']) {
  if (s === 'upcoming') return 'info' as const
  if (s === 'live') return 'success' as const
  if (s === 'cancelled') return 'danger' as const
  return 'neutral' as const
}

export function EventsTable() {
  const { data = [] } = useGetEventsQuery()
  const [setStatus] = useSetEventStatusMutation()
  const table = useTableState(data, (r: Meetup) => `${r.title} ${r.city} ${r.host}`, 'date')

  return (
    <Card padding={false}>
      <FilterBar search={table.search} onSearch={table.setSearch} />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        columns={[
          { key: 'title', header: 'Event', sortable: true, render: (r) => <span className="font-medium">{r.title}</span> },
          { key: 'city', header: 'City', render: (r) => r.city },
          { key: 'date', header: 'Date', sortable: true, render: (r) => formatDisplayDate(r.date) },
          { key: 'host', header: 'Host', render: (r) => r.host },
          { key: 'attendees', header: 'RSVPs', render: (r) => String(r.attendees) },
          { key: 'status', header: 'Status', render: (r) => <Badge tone={tone(r.status)}>{r.status}</Badge> },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <RowMenu
                items={[
                  { label: 'Cancel', danger: true, onClick: () => setStatus({ id: r.id, status: 'cancelled' }) },
                ]}
              />
            ),
          },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />
    </Card>
  )
}
