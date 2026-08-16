import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { useTableState } from '@/hooks/useTableState'
import { useGetDestinationsQuery, useToggleFeaturedMutation } from '@/services/endpoints/destinationsApi'
import type { Destination } from '@/lib/destinationsStore'

export function DestinationsTable() {
  const { data = [] } = useGetDestinationsQuery()
  const [toggle] = useToggleFeaturedMutation()
  const table = useTableState(data, (r: Destination) => `${r.city} ${r.country}`, 'travellers', 'desc')

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
          { key: 'city', header: 'City', sortable: true, render: (r) => <span className="font-medium">{r.city}</span> },
          { key: 'country', header: 'Country', render: (r) => r.country },
          { key: 'travellers', header: 'Travellers', sortable: true, render: (r) => String(r.travellers) },
          { key: 'featured', header: 'Featured', render: (r) => <Badge tone={r.featured ? 'info' : 'neutral'}>{r.featured ? 'Yes' : 'No'}</Badge> },
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
