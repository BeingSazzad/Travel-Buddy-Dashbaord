import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { PlaceChip } from '@/components/shared/EntityChip'
import { useTableState } from '@/hooks/useTableState'
import { useGetDestinationsQuery } from '@/services/endpoints/destinationsApi'
import type { Destination } from '@/lib/destinationsStore'

export function DestinationsTable() {
  const { data = [] } = useGetDestinationsQuery()
  const table = useTableState(data, (r: Destination) => `${r.city} ${r.country}`, 'travellers', 'desc')

  return (
    <Card padding={false}>
      <FilterBar search={table.search} onSearch={table.setSearch} placeholder="Search cities…" />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        empty="No destinations match this search."
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        columns={[
          {
            key: 'city',
            header: 'City',
            sortable: true,
            render: (r) => <PlaceChip id={r.id} title={r.city} subtitle={r.country} city={r.city} />,
          },
          { key: 'travellers', header: 'Travellers', sortable: true, render: (r) => String(r.travellers) },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />
    </Card>
  )
}
