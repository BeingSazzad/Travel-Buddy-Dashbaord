import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { useTableState } from '@/hooks/useTableState'
import { formatDisplayDate, formatUsd } from '@/lib/utils'
import { useGetSubscriptionsQuery } from '@/services/endpoints/subscriptionsApi'
import type { Subscription } from '@/lib/subscriptionsStore'

function tone(s: Subscription['status']) {
  if (s === 'active') return 'success' as const
  if (s === 'pending') return 'warn' as const
  if (s === 'cancelled') return 'danger' as const
  return 'neutral' as const
}

export function SubscriptionsTable() {
  const { data = [] } = useGetSubscriptionsQuery()
  const table = useTableState(data, (r: Subscription) => `${r.member} ${r.plan} ${r.status}`, 'member')

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
          { key: 'member', header: 'Member', sortable: true, render: (r) => <span className="font-medium">{r.member}</span> },
          { key: 'plan', header: 'Plan', render: (r) => r.plan },
          { key: 'amount', header: 'Amount', render: (r) => formatUsd(r.amount) },
          { key: 'renews', header: 'Renews', render: (r) => formatDisplayDate(r.renews) },
          { key: 'status', header: 'Status', render: (r) => <Badge tone={tone(r.status)}>{r.status}</Badge> },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />
    </Card>
  )
}
