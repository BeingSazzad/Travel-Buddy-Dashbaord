import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { ConfirmAction } from '@/components/shared/ConfirmAction'
import { PersonChip, PlaceChip } from '@/components/shared/EntityChip'
import { tripPath } from '@/constants/routes'
import { useTableState } from '@/hooks/useTableState'
import { formatDisplayDate } from '@/lib/utils'
import { TRIP_WHEN_OPTIONS, matchesRange, type WhenPreset } from '@/lib/whenPresets'
import {
  useDeleteTripMutation,
  useGetTripsQuery,
  useSetTripVisibilityMutation,
} from '@/services/endpoints/tripsApi'
import type { Trip } from '@/lib/tripsStore'

export function TripsTable() {
  const navigate = useNavigate()
  const { data = [] } = useGetTripsQuery()
  const [setVisibility] = useSetTripVisibilityMutation()
  const [deleteTrip] = useDeleteTripMutation()
  const [visibility, setVisibilityFilter] = useState('all')
  const [when, setWhen] = useState<WhenPreset>('all')
  const [deleting, setDeleting] = useState<Trip | null>(null)
  const scoped = useMemo(
    () =>
      data.filter(
        (r) =>
          (visibility === 'all' || r.visibility === visibility) && matchesRange(r.startDate, r.endDate, when),
      ),
    [data, visibility, when],
  )
  const table = useTableState(scoped, (r: Trip) => `${r.name} ${r.city} ${r.owner}`, 'startDate', 'desc')

  return (
    <Card padding={false}>
      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search trips by destination, title or host…"
        filters={[
          {
            key: 'visibility',
            label: 'Visibility',
            value: visibility,
            onChange: (v) => {
              setVisibilityFilter(v)
              table.setPage(1)
            },
            options: [
              { value: 'all', label: 'All' },
              { value: 'public', label: 'Public' },
              { value: 'hidden', label: 'Hidden' },
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
            options: TRIP_WHEN_OPTIONS,
          },
        ]}
      />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        empty="No trips match these filters."
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        onRowClick={(r) => navigate(tripPath(r.id))}
        columns={[
          {
            key: 'name',
            header: 'Trip',
            sortable: true,
            render: (r) => <PlaceChip id={r.id} title={r.name} subtitle={`${r.city}, ${r.country}`} city={r.city} />,
          },
          {
            key: 'startDate',
            header: 'Dates',
            sortable: true,
            render: (r) => `${formatDisplayDate(r.startDate)} – ${formatDisplayDate(r.endDate)}`,
          },
          { key: 'owner', header: 'Host', render: (r) => <PersonChip name={r.owner} /> },
          {
            key: 'visibility',
            header: 'Visibility',
            render: (r) => <Badge tone={r.visibility === 'public' ? 'success' : 'neutral'}>{r.visibility}</Badge>,
          },
          {
            key: 'actions',
            header: 'Action',
            render: (r) => (
              <RowMenu
                items={[
                  { label: 'View', onClick: () => navigate(tripPath(r.id)) },
                  {
                    label: r.visibility === 'public' ? 'Hide' : 'Make public',
                    onClick: () =>
                      setVisibility({ id: r.id, visibility: r.visibility === 'public' ? 'hidden' : 'public' }),
                  },
                  { label: 'Delete', danger: true, onClick: () => setDeleting(r) },
                ]}
              />
            ),
          },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />

      <ConfirmAction
        open={Boolean(deleting)}
        title="Delete this trip?"
        body={`${deleting?.name ?? 'This trip'} will be removed from the admin list. This demo delete cannot be undone.`}
        confirmLabel="Delete"
        danger
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) void deleteTrip(deleting.id)
          setDeleting(null)
        }}
      />
    </Card>
  )
}
