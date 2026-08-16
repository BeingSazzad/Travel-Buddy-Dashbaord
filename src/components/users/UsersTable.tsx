import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/shared/Badge'
import { PersonChip } from '@/components/shared/EntityChip'
import { FilterBar } from '@/components/shared/FilterBar'
import { Pagination } from '@/components/shared/Pagination'
import { RowMenu } from '@/components/shared/RowMenu'
import { ConfirmAction } from '@/components/shared/ConfirmAction'
import { userPath } from '@/constants/routes'
import { useTableState } from '@/hooks/useTableState'
import { useGetUsersQuery, useSetUserStatusMutation, type AdminUser } from '@/services/endpoints/usersApi'
import { useGetSubscribersQuery } from '@/services/endpoints/subscriptionsApi'
import { useGetPlansQuery } from '@/services/endpoints/plansApi'

function searchPerson(p: AdminUser) {
  return `${p.name} ${p.email} ${p.city} ${p.status}`
}

function statusTone(s: AdminUser['status']) {
  if (s === 'active') return 'success' as const
  if (s === 'pending') return 'warn' as const
  return 'danger' as const
}

function subTone(s: string) {
  if (s === 'active') return 'success' as const
  if (s === 'pending') return 'warn' as const
  return 'neutral' as const
}

export function UsersTable() {
  const navigate = useNavigate()
  const { data = [] } = useGetUsersQuery()
  const { data: subscribers = [] } = useGetSubscribersQuery()
  const { data: plans = [] } = useGetPlansQuery()
  const [setStatus] = useSetUserStatusMutation()
  const [status, setStatusFilter] = useState('all')
  const [banning, setBanning] = useState<AdminUser | null>(null)
  const scoped = useMemo(() => data.filter((p) => status === 'all' || p.status === status), [data, status])
  const table = useTableState(scoped, searchPerson, 'name')

  return (
    <Card padding={false}>
      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search members…"
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
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'banned', label: 'Banned' },
            ],
          },
        ]}
      />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        empty="No members match these filters."
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        onRowClick={(r) => navigate(userPath(r.id))}
        columns={[
          {
            key: 'name',
            header: 'Member',
            sortable: true,
            render: (r) => <PersonChip id={r.id} name={r.name} verified={r.verified} />,
          },
          { key: 'email', header: 'Email', render: (r) => r.email },
          { key: 'city', header: 'City', sortable: true, render: (r) => `${r.city}, ${r.country}` },
          { key: 'status', header: 'Status', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
          {
            key: 'subscription',
            header: 'Subscriber',
            render: (r) => {
              const sub = subscribers.find((s) => s.memberId === r.id || s.email === r.email)
              if (!sub) return <span className="text-muted">None</span>
              const plan = plans.find((p) => p.id === sub.planId)
              return (
                <span className="inline-flex items-center gap-2">
                  <span className="text-sm">{plan?.name ?? 'Plan'}</span>
                  <Badge tone={subTone(sub.status)}>{sub.status}</Badge>
                </span>
              )
            },
          },
          {
            key: 'actions',
            header: 'Action',
            render: (r) => (
              <RowMenu
                items={[
                  { label: 'View', onClick: () => navigate(userPath(r.id)) },
                  ...(r.status === 'banned'
                    ? [{ label: 'Activate', onClick: () => setStatus({ id: r.id, status: 'active' as const }) }]
                    : [{ label: 'Ban', danger: true, onClick: () => setBanning(r) }]),
                ]}
              />
            ),
          },
        ]}
      />
      <Pagination page={table.page} pages={table.pages} total={table.total} onPage={table.setPage} />

      <ConfirmAction
        open={Boolean(banning)}
        title="Ban this member?"
        body={`${banning?.name ?? 'This member'} will lose access to the app. You can activate the account again later.`}
        confirmLabel="Ban"
        danger
        onClose={() => setBanning(null)}
        onConfirm={() => {
          if (banning) void setStatus({ id: banning.id, status: 'banned' })
          setBanning(null)
        }}
      />
    </Card>
  )
}
