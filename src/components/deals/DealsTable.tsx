import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { useTableState } from '@/hooks/useTableState'
import { useGetDealsQuery, useToggleDealMutation } from '@/services/endpoints/dealsApi'
import type { Deal } from '@/lib/dealsStore'

export function DealsTable() {
  const { data = [] } = useGetDealsQuery()
  const [toggle] = useToggleDealMutation()
  const table = useTableState(data, (r: Deal) => `${r.title} ${r.partner} ${r.city}`, 'title')

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
          { key: 'title', header: 'Deal', sortable: true, render: (r) => <span className="font-medium">{r.title}</span> },
          { key: 'partner', header: 'Partner', render: (r) => r.partner },
          { key: 'city', header: 'City', render: (r) => r.city },
          { key: 'discount', header: 'Off', render: (r) => r.discount },
          { key: 'active', header: 'Status', render: (r) => <Badge tone={r.active ? 'success' : 'neutral'}>{r.active ? 'Live' : 'Off'}</Badge> },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <RowMenu items={[{ label: r.active ? 'Turn off' : 'Turn on', onClick: () => toggle(r.id) }]} />
            ),
          },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />
    </Card>
  )
}
