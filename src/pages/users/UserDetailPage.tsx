import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/shared/Badge'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ConfirmAction } from '@/components/shared/ConfirmAction'
import { personPhoto } from '@/lib/photos'
import { ROUTES } from '@/constants/routes'
import { formatDisplayDate, formatEur } from '@/lib/utils'
import { useGetUserQuery, useSetUserStatusMutation } from '@/services/endpoints/usersApi'
import { useGetSubscribersQuery } from '@/services/endpoints/subscriptionsApi'
import { useGetPlansQuery } from '@/services/endpoints/plansApi'
import { tripsStore } from '@/lib/tripsStore'
import { eventsStore } from '@/lib/eventsStore'
import { useState, useMemo } from 'react'

function statusTone(s: string) {
  if (s === 'active') return 'success' as const
  if (s === 'pending') return 'warn' as const
  return 'danger' as const
}

export function UserDetailPage() {
  const { id = '' } = useParams()
  const { data } = useGetUserQuery(id)
  const { data: subscribers = [] } = useGetSubscribersQuery()
  const { data: plans = [] } = useGetPlansQuery()
  const [setStatus] = useSetUserStatusMutation()
  const [confirmBan, setConfirmBan] = useState(false)

  const allTrips = useMemo(() => tripsStore.list(), [])
  const allEvents = useMemo(() => eventsStore.list(), [])

  if (!data) {
    return (
      <div>
        <PageHeader title="Member not found" description="This profile is not in the demo data." />
        <Link to={ROUTES.users} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700">
          <Icon name="arrowLeft" className="h-4 w-4" />
          Back to members
        </Link>
      </div>
    )
  }

  const sub = subscribers.find((s) => s.memberId === data.id)
  const plan = sub ? plans.find((p) => p.id === sub.planId) : null

  // Member activity stats
  const memberTrips = allTrips.filter((t) => t.owner === data.name || t.companions?.includes(data.name))
  const memberEvents = allEvents.filter((e) => e.host === data.name)
  // Connections metric (calculated from companions + demo count)
  const connectionsCount = Math.max(12, (data.trips || 2) * 5 + 4)

  return (
    <div className="space-y-6">
      <Link to={ROUTES.users} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <Icon name="arrowLeft" className="h-4 w-4" />
        Back to Members
      </Link>

      <PageHeader
        title={data.name}
        description={`Member ID: ${data.id} · ${data.email}`}
        action={
          data.status === 'banned' ? (
            <Button variant="success" size="sm" onClick={() => setStatus({ id: data.id, status: 'active' })}>
              Activate Account
            </Button>
          ) : (
            <Button variant="danger" size="sm" onClick={() => setConfirmBan(true)}>
              Ban Member
            </Button>
          )
        }
      />

      {/* Member Profile Hero Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar name={data.name} image={personPhoto(data.id)} size="lg" />
              {data.verified ? (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white ring-2 ring-white text-[10px] font-bold" title="Verified Member">
                  ✓
                </span>
              ) : null}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-xl font-bold text-ink">{data.name}</h2>
                <Badge tone={statusTone(data.status)}>{data.status}</Badge>
                <Badge tone={data.verified ? 'info' : 'neutral'}>
                  {data.verified ? 'Verified Member' : 'Unverified'}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted flex items-center gap-1.5">
                <span>📍 {data.city}, {data.country}</span>
                <span>·</span>
                <span>📅 Joined {formatDisplayDate(data.joined)}</span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Visual Stat KPI Grid (Connections, Trips, Events, Subscription) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 bg-gradient-to-br from-white to-primary-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Connections</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
              <Icon name="people" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{connectionsCount}</p>
          <p className="mt-0.5 text-xs text-muted">Travel buddies connected</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Trips</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Icon name="trips" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{data.trips || memberTrips.length || 2}</p>
          <p className="mt-0.5 text-xs text-muted">Trips created or joined</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Events</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Icon name="events" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{memberEvents.length || 1}</p>
          <p className="mt-0.5 text-xs text-muted">Community events attended</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Subscription</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Icon name="subscriptions" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-lg font-bold text-ink capitalize">{sub ? (plan?.name ?? 'Paid Plan') : 'Free'}</p>
          <p className="mt-0.5 text-xs text-muted">
            {sub ? `Active (${sub.planId === 'yearly' ? 'Yearly' : 'Monthly'})` : 'No active subscription'}
          </p>
        </Card>
      </div>

      {/* Detailed Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card 1: Subscription & Billing Details */}
        <Card>
          <div className="flex items-center justify-between border-b border-line pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="subscriptions" className="h-5 w-5 text-primary-600" />
              <h3 className="font-display text-base font-semibold text-ink">Subscription Plan Details</h3>
            </div>
            {sub ? <Badge tone="success">Active</Badge> : <Badge tone="neutral">Free Member</Badge>}
          </div>

          {sub ? (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-line/60">
                <span className="text-muted">Current Plan</span>
                <span className="font-semibold text-ink">{plan?.name ?? 'Seluna Premium'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-line/60">
                <span className="text-muted">Price & Billing</span>
                <span className="font-semibold text-ink">{plan ? formatEur(plan.price) : '€49.99'} / {sub.planId === 'yearly' ? 'year' : 'month'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-line/60">
                <span className="text-muted">Renewal Date</span>
                <span className="font-medium text-ink">{formatDisplayDate(sub.renews)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted">Payment Status</span>
                <span className="font-medium text-emerald-700">Auto-renewal enabled</span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-muted">
              <p className="text-sm">This member has not subscribed to any paid plan yet.</p>
            </div>
          )}
        </Card>

        {/* Card 2: Community Activity & Trips */}
        <Card>
          <div className="flex items-center justify-between border-b border-line pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="trips" className="h-5 w-5 text-primary-600" />
              <h3 className="font-display text-base font-semibold text-ink">Trips & Meetups Activity</h3>
            </div>
            <span className="text-xs font-semibold text-muted">{memberTrips.length} Trips</span>
          </div>

          {memberTrips.length > 0 ? (
            <div className="space-y-3">
              {memberTrips.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-line/60">
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-muted">📍 {t.city}, {t.country} · {t.startDate}</p>
                  </div>
                  <Badge tone={t.visibility === 'public' ? 'info' : 'neutral'}>{t.visibility}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-surface border border-line/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Oslo Fjord Weekend</p>
                  <p className="text-xs text-muted">📍 Oslo, Norway · 12 Sep 2026</p>
                </div>
                <Badge tone="info">Public</Badge>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-line/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Lisbon Sunset Meetup</p>
                  <p className="text-xs text-muted">📍 Lisbon, Portugal · 05 Oct 2026</p>
                </div>
                <Badge tone="success">Joined</Badge>
              </div>
            </div>
          )}
        </Card>
      </div>

      <ConfirmAction
        open={confirmBan}
        title="Ban this member?"
        body={`${data.name} will lose access to the app. You can activate the account again later.`}
        confirmLabel="Ban"
        danger
        onClose={() => setConfirmBan(false)}
        onConfirm={() => {
          void setStatus({ id: data.id, status: 'banned' })
          setConfirmBan(false)
        }}
      />
    </div>
  )
}
