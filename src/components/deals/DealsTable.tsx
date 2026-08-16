import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { PlaceChip } from '@/components/shared/EntityChip'
import { useTableState } from '@/hooks/useTableState'
import { useGetDealsQuery, useToggleDealMutation } from '@/services/endpoints/dealsApi'
import type { Deal } from '@/lib/dealsStore'

export function DealsTable() {
  const { data = [] } = useGetDealsQuery()
  const [toggle] = useToggleDealMutation()
  const [status, setStatus] = useState('all')
  const scoped = useMemo(
    () =>
      data.filter((r) => {
        if (status === 'live') return r.active
        if (status === 'off') return !r.active
        return true
      }),
    [data, status],
  )
  const table = useTableState(scoped, (r: Deal) => `${r.title} ${r.partner} ${r.city}`, 'title')

  return (
    <Card padding={false}>
      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search deals…"
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: status,
            onChange: (v) => {
              setStatus(v)
              table.setPage(1)
            },
            options: [
              { value: 'all', label: 'All' },
              { value: 'live', label: 'Live' },
              { value: 'off', label: 'Off' },
            ],
          },
        ]}
      />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        empty="No deals match these filters."
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        columns={[
          {
            key: 'title',
            header: 'Deal',
            sortable: true,
            render: (r) => <PlaceChip id={r.id} title={r.title} subtitle={r.partner} city={r.city} />,
          },
          { key: 'city', header: 'City', render: (r) => r.city },
          { key: 'discount', header: 'Off', render: (r) => r.discount },
          {
            key: 'active',
            header: 'Status',
            render: (r) => <Badge tone={r.active ? 'success' : 'neutral'}>{r.active ? 'Live' : 'Off'}</Badge>,
          },
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
