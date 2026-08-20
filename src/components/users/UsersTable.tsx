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
import { Icon } from '@/components/ui/Icon'
import { userPath } from '@/constants/routes'
import { useTableState } from '@/hooks/useTableState'
import { cn, formatDisplayDate } from '@/lib/utils'
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
  const [memberType, setMemberType] = useState<'all' | 'subscribers' | 'free'>('all')
  const [banning, setBanning] = useState<AdminUser | null>(null)

  const subscriberMap = useMemo(() => {
    const map = new Map<string, (typeof subscribers)[0]>()
    subscribers.forEach((s) => {
      if (s.memberId) map.set(s.memberId, s)
      if (s.email) map.set(s.email, s)
    })
    return map
  }, [subscribers])

  const scoped = useMemo(() => {
    return data.filter((p) => {
      if (status !== 'all' && p.status !== status) return false
      const sub = subscriberMap.get(p.id) || subscriberMap.get(p.email)
      const isSub = Boolean(sub && (sub.status === 'active' || sub.status === 'pending'))
      if (memberType === 'subscribers' && !isSub) return false
      if (memberType === 'free' && isSub) return false
      return true
    })
  }, [data, status, subscriberMap, memberType])

  const table = useTableState(scoped, searchPerson, 'name')

  return (
    <Card padding={false}>
      {/* Unified Member Category Tabs */}
      <div className="flex items-center gap-1 border-b border-line px-6 pt-4 pb-0">
        <button
          type="button"
          onClick={() => {
            setMemberType('all')
            table.setPage(1)
          }}
          className={cn(
            'border-b-2 px-3 py-2 text-xs font-semibold transition-colors',
            memberType === 'all'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-muted hover:text-ink',
          )}
        >
          All Members ({data.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setMemberType('subscribers')
            table.setPage(1)
          }}
          className={cn(
            'flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-colors',
            memberType === 'subscribers'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-muted hover:text-ink',
          )}
        >
          <span>Subscribers</span>
          <span className="rounded-full bg-primary-100 px-1.5 py-0.2 text-[10px] text-primary-800">
            {subscribers.filter((s) => s.status === 'active' || s.status === 'pending').length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMemberType('free')
            table.setPage(1)
          }}
          className={cn(
            'border-b-2 px-3 py-2 text-xs font-semibold transition-colors',
            memberType === 'free'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-muted hover:text-ink',
          )}
        >
          Free Members
        </button>
      </div>

      <FilterBar
        search={table.search}
        onSearch={table.setSearch}
        placeholder="Search members by name, email or city…"
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
              { value: 'all', label: 'All Status' },
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
            render: (r) => {
              const sub = subscriberMap.get(r.id) || subscriberMap.get(r.email)
              const isSub = Boolean(sub && (sub.status === 'active' || sub.status === 'pending'))
              return (
                <div className="flex items-center gap-2">
                  <PersonChip id={r.id} name={r.name} verified={r.verified} />
                  {isSub ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 border border-primary-200 px-2 py-0.5 text-[11px] font-semibold text-primary-700 shrink-0">
                      <Icon name="star" className="h-3 w-3 text-primary-600 fill-primary-600" />
                      Subscriber
                    </span>
                  ) : null}
                </div>
              )
            },
          },
          { key: 'email', header: 'Email', render: (r) => r.email },
          { key: 'city', header: 'City', sortable: true, render: (r) => `${r.city}, ${r.country}` },
          {
            key: 'subscription',
            header: 'Plan / Subscription',
            render: (r) => {
              const sub = subscriberMap.get(r.id) || subscriberMap.get(r.email)
              if (!sub) return <span className="text-xs text-muted">Free Plan</span>
              const plan = plans.find((p) => p.id === sub.planId)
              return (
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-ink">{plan?.name ?? 'Pro Plan'}</span>
                  <span className="text-[11px] text-muted">Renews {formatDisplayDate(sub.renews)}</span>
                </div>
              )
            },
          },
          {
            key: 'status',
            header: 'Account Status',
            render: (r) => {
              const sub = subscriberMap.get(r.id) || subscriberMap.get(r.email)
              if (sub) return <Badge tone={subTone(sub.status)}>{`Sub: ${sub.status}`}</Badge>
              return <Badge tone={statusTone(r.status)}>{r.status}</Badge>
            },
          },
          {
            key: 'actions',
            header: 'Action',
            render: (r) => (
              <RowMenu
                items={[
                  { label: 'View profile', onClick: () => navigate(userPath(r.id)) },
                  ...(r.status === 'banned'
                    ? [{ label: 'Activate account', onClick: () => setStatus({ id: r.id, status: 'active' as const }) }]
                    : [{ label: 'Ban member', danger: true, onClick: () => setBanning(r) }]),
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
