import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { PersonChip } from '@/components/shared/EntityChip'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { userPath } from '@/constants/routes'
import { formatDisplayDate, formatEur } from '@/lib/utils'
import { useTableState } from '@/hooks/useTableState'
import { SubscriberFormModal } from '@/components/subscriptions/SubscriberFormModal'
import { ConfirmAction } from '@/components/shared/ConfirmAction'
import { useGetPlansQuery } from '@/services/endpoints/plansApi'
import {
  useGetSubscribersQuery,
  useRemoveSubscriberMutation,
  useSaveSubscriberMutation,
  type Subscriber,
} from '@/services/endpoints/subscriptionsApi'

function tone(s: Subscriber['status']) {
  if (s === 'active') return 'success' as const
  if (s === 'pending') return 'warn' as const
  if (s === 'cancelled') return 'danger' as const
  return 'neutral' as const
}

export function SubscribersTable() {
  const navigate = useNavigate()
  const { data = [] } = useGetSubscribersQuery()
  const { data: plans = [] } = useGetPlansQuery()
  const [save] = useSaveSubscriberMutation()
  const [remove] = useRemoveSubscriberMutation()
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState<Subscriber | null | 'new'>(null)
  const [dropping, setDropping] = useState<Subscriber | null>(null)

  const planName = (id: string) => plans.find((p) => p.id === id)?.name ?? id
  const planPrice = (id: string) => plans.find((p) => p.id === id)?.price

  const scoped = useMemo(() => data.filter((row) => status === 'all' || row.status === status), [data, status])
  const table = useTableState(scoped, (r) => `${r.member} ${r.email} ${planName(r.planId)} ${r.status}`, 'member')

  return (
    <Card padding={false}>
      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search subscribers…"
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
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'expired', label: 'Expired' },
            ],
          },
        ]}
      />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        empty="No subscribers match these filters."
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        columns={[
          {
            key: 'member',
            header: 'Member',
            sortable: true,
            render: (r) => <PersonChip id={r.memberId} name={r.member} to={userPath(r.memberId)} />,
          },
          { key: 'planId', header: 'Plan', render: (r) => planName(r.planId) },
          {
            key: 'amount',
            header: 'Price',
            render: (r) => {
              const price = planPrice(r.planId)
              return price != null ? formatEur(price) : '—'
            },
          },
          { key: 'renews', header: 'Renews', render: (r) => formatDisplayDate(r.renews) },
          { key: 'status', header: 'Status', render: (r) => <Badge tone={tone(r.status)}>{r.status}</Badge> },
          {
            key: 'actions',
            header: 'Action',
            render: (r) => (
              <RowMenu
                items={[
                  { label: 'View member', onClick: () => navigate(userPath(r.memberId)) },
                  { label: 'Edit', onClick: () => setEditing(r) },
                  { label: 'Remove', danger: true, onClick: () => setDropping(r) },
                ]}
              />
            ),
          },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />

      <SubscriberFormModal
        open={editing !== null}
        subscriber={editing === 'new' ? null : editing}
        takenMemberIds={data.map((row) => row.memberId)}
        onClose={() => setEditing(null)}
        onSave={(row) => {
          void save(row)
          setEditing(null)
        }}
      />

      <ConfirmAction
        open={Boolean(dropping)}
        title="Remove subscriber?"
        body="This member will no longer be listed as a subscriber. Their account stays in Members."
        confirmLabel="Remove"
        danger
        onClose={() => setDropping(null)}
        onConfirm={() => {
          if (dropping) void remove(dropping.id)
          setDropping(null)
        }}
      />
    </Card>
  )
}
