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
import { useTableState } from '@/hooks/useTableState'
import { useGetUsersQuery, useSetUserStatusMutation, type AdminUser } from '@/services/endpoints/usersApi'

function searchPerson(p: AdminUser) {
  return `${p.name} ${p.email} ${p.city} ${p.status}`
}

function statusTone(s: AdminUser['status']) {
  if (s === 'active') return 'success' as const
  if (s === 'pending') return 'warn' as const
  return 'danger' as const
}

export function UsersTable() {
  const navigate = useNavigate()
  const { data = [] } = useGetUsersQuery()
  const [setStatus] = useSetUserStatusMutation()
  const [status, setStatusFilter] = useState('all')
  const scoped = useMemo(() => data.filter((p) => status === 'all' || p.status === status), [data, status])
  const table = useTableState(scoped, searchPerson, 'name')

  return (
    <Card padding={false}>
      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
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
              { value: 'suspended', label: 'Suspended' },
              { value: 'banned', label: 'Banned' },
            ],
          },
        ]}
      />
      <DataTable
        rows={table.paged}
        rowKey={(r) => r.id}
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.onSort}
        onRowClick={(r) => navigate(userPath(r.id))}
        columns={[
          { key: 'name', header: 'Member', sortable: true, render: (r) => <PersonChip name={r.name} /> },
          { key: 'email', header: 'Email', render: (r) => r.email },
          { key: 'city', header: 'City', sortable: true, render: (r) => `${r.city}, ${r.country}` },
          { key: 'status', header: 'Status', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
          { key: 'subscription', header: 'Plan', render: (r) => <Badge tone={r.subscription === 'active' ? 'info' : 'neutral'}>{r.subscription}</Badge> },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <RowMenu
                items={[
                  { label: 'View', onClick: () => navigate(userPath(r.id)) },
                  { label: 'Suspend', onClick: () => setStatus({ id: r.id, status: 'suspended' }) },
                  { label: 'Ban', danger: true, onClick: () => setStatus({ id: r.id, status: 'banned' }) },
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
