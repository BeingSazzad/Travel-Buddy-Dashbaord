import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { PersonChip, PlaceChip } from '@/components/shared/EntityChip'
import { ConfirmAction } from '@/components/shared/ConfirmAction'
import { useTableState } from '@/hooks/useTableState'
import { formatDisplayDate } from '@/lib/utils'
import { EVENT_WHEN_OPTIONS, matchesWhen, type WhenPreset } from '@/lib/whenPresets'
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
  const [setEventStatus] = useSetEventStatusMutation()
  const [status, setStatusFilter] = useState('all')
  const [when, setWhen] = useState<WhenPreset>('all')
  const [cancelling, setCancelling] = useState<Meetup | null>(null)
  const scoped = useMemo(
    () =>
      data.filter(
        (r) => (status === 'all' || r.status === status) && matchesWhen(r.date, when),
      ),
    [data, status, when],
  )
  const table = useTableState(scoped, (r: Meetup) => `${r.title} ${r.city} ${r.host}`, 'date')

  return (
    <Card padding={false}>
      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search events…"
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: status,
            onChange: (v) => {
              setStatusFilter(v)
              table.setPage(1)
            },
            options: [
              { value: 'all', label: 'All status' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'live', label: 'Live' },
              { value: 'ended', label: 'Ended' },
              { value: 'cancelled', label: 'Cancelled' },
            ],
          },
          {
            key: 'when',
            label: 'When',
            value: when,
            onChange: (v) => {
              setWhen(v as WhenPreset)
              table.setPage(1)
            },
            options: EVENT_WHEN_OPTIONS,
          },
        ]}
      />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        empty="No events match these filters."
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        columns={[
          {
            key: 'title',
            header: 'Event',
            sortable: true,
            render: (r) => <PlaceChip id={r.id} title={r.title} subtitle={r.city} city={r.city} />,
          },
          { key: 'date', header: 'Date', sortable: true, render: (r) => formatDisplayDate(r.date) },
          { key: 'host', header: 'Host', render: (r) => <PersonChip name={r.host} /> },
          { key: 'attendees', header: 'RSVPs', render: (r) => String(r.attendees) },
          { key: 'status', header: 'Status', render: (r) => <Badge tone={tone(r.status)}>{r.status}</Badge> },
          {
            key: 'actions',
            header: 'Action',
            render: (r) => (
              <RowMenu
                items={
                  r.status === 'upcoming' || r.status === 'live'
                    ? [{ label: 'Cancel', danger: true, onClick: () => setCancelling(r) }]
                    : []
                }
              />
            ),
          },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />

      <ConfirmAction
        open={Boolean(cancelling)}
        title="Cancel this event?"
        body={`${cancelling?.title ?? 'This event'} will be marked cancelled. Members who RSVP’d will still see it as cancelled.`}
        confirmLabel="Cancel event"
        danger
        onClose={() => setCancelling(null)}
        onConfirm={() => {
          if (cancelling) void setEventStatus({ id: cancelling.id, status: 'cancelled' })
          setCancelling(null)
        }}
      />
    </Card>
  )
}
