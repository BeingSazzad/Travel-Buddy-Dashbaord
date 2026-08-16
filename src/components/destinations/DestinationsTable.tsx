import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { PlaceChip } from '@/components/shared/EntityChip'
import { useTableState } from '@/hooks/useTableState'
import { useGetDestinationsQuery, useToggleFeaturedMutation } from '@/services/endpoints/destinationsApi'
import type { Destination } from '@/lib/destinationsStore'

export function DestinationsTable() {
  const { data = [] } = useGetDestinationsQuery()
  const [toggle] = useToggleFeaturedMutation()
  const [featured, setFeatured] = useState('all')
  const scoped = useMemo(
    () =>
      data.filter((r) => {
        if (featured === 'yes') return r.featured
        if (featured === 'no') return !r.featured
        return true
      }),
    [data, featured],
  )
  const table = useTableState(scoped, (r: Destination) => `${r.city} ${r.country}`, 'travellers', 'desc')

  return (
    <Card padding={false}>
      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search cities…"
        filters={[
          {
            key: 'featured',
            label: 'Featured',
            value: featured,
            onChange: (v) => {
              setFeatured(v)
              table.setPage(1)
            },
            options: [
              { value: 'all', label: 'All' },
              { value: 'yes', label: 'Featured' },
              { value: 'no', label: 'Not featured' },
            ],
          },
        ]}
      />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        empty="No destinations match these filters."
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
