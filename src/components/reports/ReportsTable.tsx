import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { useTableState } from '@/hooks/useTableState'
import { formatDisplayDate } from '@/lib/utils'
import { useGetReportsQuery, useSetReportStatusMutation } from '@/services/endpoints/reportsApi'
import type { Report } from '@/lib/reportsStore'

function tone(s: Report['status']) {
  if (s === 'pending') return 'warn' as const
  if (s === 'reviewing') return 'info' as const
  if (s === 'resolved') return 'success' as const
  return 'neutral' as const
}

export function ReportsTable() {
  const { data = [] } = useGetReportsQuery()
  const [setStatus] = useSetReportStatusMutation()
  const table = useTableState(data, (r: Report) => `${r.target} ${r.reason} ${r.reporter}`, 'createdAt', 'desc')

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
          { key: 'target', header: 'Target', sortable: true, render: (r) => <span className="font-medium">{r.target}</span> },
          { key: 'type', header: 'Type', render: (r) => r.type },
          { key: 'reason', header: 'Reason', render: (r) => r.reason },
          { key: 'reporter', header: 'Reporter', render: (r) => r.reporter },
          { key: 'createdAt', header: 'Opened', render: (r) => formatDisplayDate(r.createdAt) },
          { key: 'status', header: 'Status', render: (r) => <Badge tone={tone(r.status)}>{r.status}</Badge> },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <RowMenu
                items={[
                  { label: 'Resolve', onClick: () => setStatus({ id: r.id, status: 'resolved' }) },
                  { label: 'Dismiss', onClick: () => setStatus({ id: r.id, status: 'dismissed' }) },
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
