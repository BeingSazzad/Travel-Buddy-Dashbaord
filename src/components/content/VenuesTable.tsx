import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { PlaceChip } from '@/components/shared/EntityChip'
import { useTableState } from '@/hooks/useTableState'
import { venueKindLabel } from '@/lib/utils'
import { useGetVenuesQuery, useToggleVenueFeaturedMutation } from '@/services/endpoints/venuesApi'
import type { Venue } from '@/lib/venuesStore'

export function VenuesTable() {
  const { data = [] } = useGetVenuesQuery()
  const [toggle] = useToggleVenueFeaturedMutation()
  const [kind, setKind] = useState('all')
  const scoped = useMemo(() => data.filter((v) => kind === 'all' || v.kind === kind), [data, kind])
  const table = useTableState(scoped, (r: Venue) => `${r.name} ${r.city} ${r.kind}`, 'name')

  return (
    <Card padding={false}>
      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search venues…"
        filters={[
          {
            key: 'kind',
            label: 'Type',
            value: kind,
            onChange: (v) => {
              setKind(v)
              table.setPage(1)
            },
            options: [
              { value: 'all', label: 'All' },
              { value: 'cafe', label: 'Cafés' },
              { value: 'restaurant', label: 'Restaurants' },
              { value: 'hotel', label: 'Hotels' },
            ],
          },
        ]}
      />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        empty="No venues match these filters."
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        columns={[
          {
            key: 'name',
            header: 'Venue',
            sortable: true,
            render: (r) => <PlaceChip id={r.id} title={r.name} subtitle={`${venueKindLabel(r.kind)} · ${r.city}`} city={r.city} />,
          },
          { key: 'city', header: 'City', render: (r) => r.city },
          {
            key: 'featured',
            header: 'Featured',
            render: (r) => <Badge tone={r.featured ? 'info' : 'neutral'}>{r.featured ? 'Yes' : 'No'}</Badge>,
          },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <RowMenu items={[{ label: r.featured ? 'Unfeature' : 'Feature', onClick: () => toggle(r.id) }]} />
            ),
          },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />
    </Card>
  )
}
