import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { useTableState } from '@/hooks/useTableState'
import { formatDisplayDate } from '@/lib/utils'
import { useGetTripsQuery, useSetTripVisibilityMutation } from '@/services/endpoints/tripsApi'
import type { Trip } from '@/lib/tripsStore'

export function TripsTable() {
  const { data = [] } = useGetTripsQuery()
  const [setVisibility] = useSetTripVisibilityMutation()
  const table = useTableState(data, (r: Trip) => `${r.name} ${r.city} ${r.owner}`, 'startDate', 'desc')

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
          { key: 'name', header: 'Trip', sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
          { key: 'city', header: 'Where', render: (r) => `${r.city}, ${r.country}` },
          { key: 'startDate', header: 'Dates', sortable: true, render: (r) => `${formatDisplayDate(r.startDate)} – ${formatDisplayDate(r.endDate)}` },
          { key: 'owner', header: 'Host', render: (r) => r.owner },
          { key: 'visibility', header: 'Visibility', render: (r) => <Badge tone={r.visibility === 'public' ? 'success' : 'neutral'}>{r.visibility}</Badge> },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <RowMenu
                items={[
                  {
                    label: r.visibility === 'public' ? 'Hide' : 'Make public',
                    onClick: () => setVisibility({ id: r.id, visibility: r.visibility === 'public' ? 'hidden' : 'public' }),
                  },
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
