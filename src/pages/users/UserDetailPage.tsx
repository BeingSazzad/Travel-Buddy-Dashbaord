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
import { formatDisplayDate } from '@/lib/utils'
import { useGetUserQuery, useSetUserStatusMutation } from '@/services/endpoints/usersApi'
import { useGetSubscribersQuery } from '@/services/endpoints/subscriptionsApi'
import { useGetPlansQuery } from '@/services/endpoints/plansApi'
import { useState } from 'react'

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

  return (
    <div>
      <Link to={ROUTES.users} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <Icon name="arrowLeft" className="h-4 w-4" />
        Members
      </Link>
      <PageHeader
        title={data.name}
        description={data.email}
        action={
          data.status === 'banned' ? (
            <Button variant="success" size="sm" onClick={() => setStatus({ id: data.id, status: 'active' })}>
              Activate
            </Button>
          ) : (
            <Button variant="danger" size="sm" onClick={() => setConfirmBan(true)}>
              Ban
            </Button>
          )
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="flex flex-wrap items-start gap-6">
          <Avatar name={data.name} image={personPhoto(data.id)} size="lg" />
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <p className="text-sm text-muted">
              City <span className="block font-medium text-ink">{data.city}, {data.country}</span>
            </p>
            <p className="text-sm text-muted">
              Joined <span className="block font-medium text-ink">{formatDisplayDate(data.joined)}</span>
            </p>
            <p className="text-sm text-muted">
              Status
              <span className="mt-1 block">
                <Badge tone={statusTone(data.status)}>{data.status}</Badge>
              </span>
            </p>
            <p className="text-sm text-muted">
              Verified
              <span className="mt-1 block">
                <Badge tone={data.verified ? 'info' : 'neutral'}>{data.verified ? 'Verified' : 'Unverified'}</Badge>
              </span>
            </p>
            <p className="text-sm text-muted">
              Trips <span className="block font-medium text-ink">{data.trips}</span>
            </p>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Subscriber</p>
          {sub ? (
            <div className="mt-3 space-y-3">
              <p className="font-display text-lg font-semibold text-ink">{plan?.name ?? 'Plan'}</p>
              <Badge tone={sub.status === 'active' ? 'success' : 'neutral'}>{sub.status}</Badge>
              <p className="text-sm text-muted">Renews {formatDisplayDate(sub.renews)}</p>
              <Link to={ROUTES.subscribers} className="inline-flex text-sm font-medium text-primary-700 hover:underline">
                Open subscribers
              </Link>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Not on a paid plan.</p>
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
