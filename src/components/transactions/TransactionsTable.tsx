import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { PersonChip } from '@/components/shared/EntityChip'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { KpiCard } from '@/components/ui/KpiCard'
import { useTableState } from '@/hooks/useTableState'
import { formatDisplayDate, formatEur, labelize } from '@/lib/utils'
import { transactionTotals, type Transaction } from '@/lib/transactionsStore'
import { useGetTransactionsQuery } from '@/services/endpoints/transactionsApi'

function statusTone(s: Transaction['status']) {
  if (s === 'paid') return 'success' as const
  if (s === 'pending') return 'warn' as const
  if (s === 'refunded') return 'neutral' as const
  return 'danger' as const
}

function kindLabel(kind: Transaction['kind']) {
  if (kind === 'subscription') return 'New plan'
  if (kind === 'renewal') return 'Renewal'
  return 'Refund'
}

export function TransactionsTable() {
  const { data = [] } = useGetTransactionsQuery()
  const [status, setStatus] = useState('all')
  const scoped = useMemo(() => data.filter((r) => status === 'all' || r.status === status), [data, status])
  const table = useTableState(
    scoped,
    (r) => `${r.member} ${r.email} ${r.plan} ${r.reference} ${r.kind}`,
    'paidAt',
    'desc',
  )
  const totals = transactionTotals(data)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Collected this month" value={formatEur(totals.thisMonth)} hint="Paid this month" />
        <KpiCard label="Total collected" value={formatEur(totals.collected)} hint={`${totals.count} paid`} />
        <KpiCard label="Pending" value={formatEur(totals.pending)} hint="Awaiting card" />
        <KpiCard label="Refunded" value={formatEur(totals.refunded)} hint="Returned to members" />
      </div>

      <Card padding={false}>
        <FilterBar
          search={table.search}
          onSearch={table.setSearch}
          placeholder="Search payments…"
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
                { value: 'paid', label: 'Paid' },
                { value: 'pending', label: 'Pending' },
                { value: 'refunded', label: 'Refunded' },
                { value: 'failed', label: 'Failed' },
              ],
            },
          ]}
        />
        <DataTable
          rows={table.paged}
          rowKey={(r) => r.id}
          empty="No payments match these filters."
          sortKey={table.sortKey}
          sortDir={table.sortDir}
          onSort={table.onSort}
          columns={[
            {
              key: 'paidAt',
              header: 'Date',
              sortable: true,
              render: (r) => formatDisplayDate(r.paidAt),
            },
            {
              key: 'member',
              header: 'Member',
              sortable: true,
              render: (r) => <PersonChip id={r.memberId} name={r.member} />,
            },
            { key: 'plan', header: 'Plan', render: (r) => `${r.plan} · ${kindLabel(r.kind)}` },
            {
              key: 'amount',
              header: 'Amount',
              sortable: true,
              render: (r) => (
                <span className={r.amount < 0 ? 'text-rose-700' : 'font-medium text-ink'}>{formatEur(r.amount)}</span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <Badge tone={statusTone(r.status)}>{labelize(r.status)}</Badge>,
            },
            { key: 'method', header: 'Method', render: (r) => r.method },
          ]}
        />
        <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />
      </Card>
    </div>
  )
}
