import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { PersonChip } from '@/components/shared/EntityChip'
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
  const [status, setStatusFilter] = useState('all')
  const scoped = useMemo(() => data.filter((r) => status === 'all' || r.status === status), [data, status])
  const table = useTableState(scoped, (r: Report) => `${r.target} ${r.reason} ${r.reporter}`, 'createdAt', 'desc')

  return (
    <Card padding={false}>
      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search reports…"
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: status,
            onChange: (v) => {
              setStatusFilter(v)
              table.setPage(1)
            },
            options: [
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'reviewing', label: 'Reviewing' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'dismissed', label: 'Dismissed' },
            ],
          },
        ]}
      />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        empty="No reports match these filters."
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        columns={[
          {
            key: 'target',
            header: 'Target',
            sortable: true,
            render: (r) =>
              r.type === 'user' ? (
                <PersonChip name={r.target} />
              ) : (
                <span className="font-medium">{r.target}</span>
              ),
          },
          { key: 'type', header: 'Type', render: (r) => <Badge tone="neutral">{r.type}</Badge> },
          { key: 'reason', header: 'Reason', render: (r) => r.reason },
          { key: 'reporter', header: 'Reporter', render: (r) => <PersonChip name={r.reporter} /> },
          { key: 'createdAt', header: 'Opened', sortable: true, render: (r) => formatDisplayDate(r.createdAt) },
          { key: 'status', header: 'Status', render: (r) => <Badge tone={tone(r.status)}>{r.status}</Badge> },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <RowMenu
                items={
                  r.status === 'pending' || r.status === 'reviewing'
                    ? [
                        ...(r.status === 'pending'
                          ? [{ label: 'Start review', onClick: () => setStatus({ id: r.id, status: 'reviewing' as const }) }]
                          : []),
                        { label: 'Resolve', onClick: () => setStatus({ id: r.id, status: 'resolved' as const }) },
                        { label: 'Dismiss', onClick: () => setStatus({ id: r.id, status: 'dismissed' as const }) },
                      ]
                    : []
                }
              />
            ),
          },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />
    </Card>
  )
}
