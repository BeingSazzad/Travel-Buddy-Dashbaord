import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { useTableState } from '@/hooks/useTableState'
import { useGetReviewsQuery, useSetReviewFlagMutation } from '@/services/endpoints/reviewsApi'
import type { Review } from '@/lib/reviewsStore'

export function ReviewsTable() {
  const { data = [] } = useGetReviewsQuery()
  const [setFlag] = useSetReviewFlagMutation()
  const table = useTableState(data, (r: Review) => `${r.place} ${r.author} ${r.city}`, 'rating', 'desc')

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
          { key: 'place', header: 'Place', sortable: true, render: (r) => <span className="font-medium">{r.place}</span> },
          { key: 'city', header: 'City', render: (r) => r.city },
          { key: 'author', header: 'Author', render: (r) => r.author },
          { key: 'rating', header: 'Rating', sortable: true, render: (r) => `${r.rating}/5` },
          { key: 'excerpt', header: 'Note', render: (r) => <span className="text-muted">{r.excerpt}</span> },
          { key: 'flagged', header: 'Flag', render: (r) => <Badge tone={r.flagged ? 'danger' : 'success'}>{r.flagged ? 'Flagged' : 'OK'}</Badge> },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <RowMenu items={[{ label: r.flagged ? 'Clear flag' : 'Flag', onClick: () => setFlag({ id: r.id, flagged: !r.flagged }) }]} />
            ),
          },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />
    </Card>
  )
}
