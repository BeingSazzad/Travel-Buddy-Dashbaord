import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/shared/Badge'
import { PersonChip } from '@/components/shared/EntityChip'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ConfirmAction } from '@/components/shared/ConfirmAction'
import { ROUTES } from '@/constants/routes'
import { cityHero } from '@/lib/photos'
import { formatDisplayDate } from '@/lib/utils'
import { useDeleteTripMutation, useGetTripQuery, useSetTripVisibilityMutation } from '@/services/endpoints/tripsApi'

function nights(start: string, end: string) {
  const a = new Date(`${start}T00:00:00`)
  const b = new Date(`${end}T00:00:00`)
  if (!Number.isFinite(a.getTime()) || !Number.isFinite(b.getTime())) return null
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000))
}

export function TripDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data } = useGetTripQuery(id)
  const [setVisibility] = useSetTripVisibilityMutation()
  const [deleteTrip] = useDeleteTripMutation()
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!data) {
    return (
      <div>
        <PageHeader title="Trip not found" description="This trip is not in the demo data." />
        <Link to={ROUTES.trips} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700">
          <Icon name="arrowLeft" className="h-4 w-4" />
          Back to trips
        </Link>
      </div>
    )
  }

  const stay = nights(data.startDate, data.endDate)
  const publicTrip = data.visibility === 'public'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to={ROUTES.trips} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <Icon name="arrowLeft" className="h-4 w-4" />
          Back to Trips
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setVisibility({ id: data.id, visibility: publicTrip ? 'hidden' : 'public' })
            }
          >
            {publicTrip ? 'Hide' : 'Make public'}
          </Button>
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        </div>
      </div>

      <PageHeader
        title={data.name}
        description={`${data.city}, ${data.country} · ${formatDisplayDate(data.startDate)} – ${formatDisplayDate(data.endDate)}${stay != null ? ` (${stay} nights)` : ''}`}
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {/* Cover Photo & Overview */}
          <Card padding={false} className="overflow-hidden">
            <img
              src={cityHero(data.city)}
              alt={data.name}
              className="h-56 w-full object-cover sm:h-72 bg-slate-200"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
              }}
            />
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap gap-2">
                <Badge tone={publicTrip ? 'success' : 'neutral'}>{data.visibility.toUpperCase()}</Badge>
                <Badge tone="info">{data.style}</Badge>
                {stay != null ? <Badge tone="neutral">{`${stay} nights`}</Badge> : null}
              </div>
              <p className="text-sm leading-relaxed text-ink">{data.description}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Trip details</p>
            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-sm text-muted">Dates</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {formatDisplayDate(data.startDate)} – {formatDisplayDate(data.endDate)}
                  {stay != null ? <span className="ml-1 text-sm font-normal text-muted">({stay} nights)</span> : null}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Meeting point</dt>
                <dd className="mt-0.5 font-medium text-ink">{data.meetingPoint}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Spots</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {data.spotsTaken} of {data.spots} filled
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Budget / day</dt>
                <dd className="mt-0.5 font-medium text-ink">{data.budgetPerDay}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Created</dt>
                <dd className="mt-0.5 font-medium text-ink">{formatDisplayDate(data.createdAt)}</dd>
              </div>
            </dl>
          </Card>

          {/* Organised By / Host Section (App Figma Alignment) */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Organised by</p>
            <div className="mt-3 flex items-center justify-between">
              <PersonChip name={data.owner} size="md" />
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">Organiser (Host)</span>
            </div>
          </Card>

          {/* Travel Companions Section */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Travel Companions</p>
              <span className="text-xs font-semibold text-muted">{(data.companions ?? []).length} Joined</span>
            </div>
            {(data.companions ?? []).length > 0 ? (
              <ul className="space-y-2.5">
                {data.companions.map((name) => (
                  <li key={name}>
                    <PersonChip name={name} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No companions have joined yet.</p>
            )}
          </Card>

        </div>
      </div>

      <ConfirmAction
        open={confirmDelete}
        title="Delete this trip?"
        body={`${data.name} will be removed from the admin list. This demo delete cannot be undone.`}
        confirmLabel="Delete"
        danger
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          void deleteTrip(data.id).then(() => navigate(ROUTES.trips))
          setConfirmDelete(false)
        }}
      />
    </div>
  )
}
