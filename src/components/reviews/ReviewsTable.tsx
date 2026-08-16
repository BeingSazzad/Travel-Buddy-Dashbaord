import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { PersonChip, PlaceChip } from '@/components/shared/EntityChip'
import { useTableState } from '@/hooks/useTableState'
import { useGetReviewsQuery, useSetReviewFlagMutation } from '@/services/endpoints/reviewsApi'
import type { Review } from '@/lib/reviewsStore'

export function ReviewsTable() {
  const { data = [] } = useGetReviewsQuery()
  const [setFlag] = useSetReviewFlagMutation()
  const [flag, setFlagFilter] = useState('all')
  const scoped = useMemo(
    () =>
      data.filter((r) => {
        if (flag === 'flagged') return r.flagged
        if (flag === 'ok') return !r.flagged
        return true
      }),
    [data, flag],
  )
  const table = useTableState(scoped, (r: Review) => `${r.place} ${r.author} ${r.city}`, 'rating', 'desc')

  return (
    <Card padding={false}>
      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search reviews…"
        filters={[
          {
            key: 'flag',
            label: 'Flag',
            value: flag,
            onChange: (v) => {
              setFlagFilter(v)
              table.setPage(1)
            },
            options: [
              { value: 'all', label: 'All' },
              { value: 'flagged', label: 'Flagged' },
              { value: 'ok', label: 'OK' },
            ],
          },
        ]}
      />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        empty="No reviews match these filters."
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        columns={[
          {
            key: 'place',
            header: 'Place',
            sortable: true,
            render: (r) => <PlaceChip id={r.id} title={r.place} subtitle={r.city} city={r.city} />,
          },
          { key: 'author', header: 'Author', render: (r) => <PersonChip name={r.author} /> },
          { key: 'rating', header: 'Rating', sortable: true, render: (r) => `${r.rating}/5` },
          {
            key: 'excerpt',
            header: 'Note',
            render: (r) => <span className="line-clamp-2 max-w-xs text-muted">{r.excerpt}</span>,
          },
          {
            key: 'flagged',
            header: 'Flag',
            render: (r) => <Badge tone={r.flagged ? 'danger' : 'success'}>{r.flagged ? 'Flagged' : 'OK'}</Badge>,
          },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <RowMenu
                items={[
                  {
                    label: r.flagged ? 'Clear flag' : 'Flag',
                    onClick: () => setFlag({ id: r.id, flagged: !r.flagged }),
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
