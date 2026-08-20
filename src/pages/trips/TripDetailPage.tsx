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
    <div>
      <Link to={ROUTES.trips} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <Icon name="arrowLeft" className="h-4 w-4" />
        Trips
      </Link>
      <PageHeader
        title={data.name}
        description={`${data.city}, ${data.country} · ${formatDisplayDate(data.startDate)} – ${formatDisplayDate(data.endDate)}`}
        action={
          <>
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
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card padding={false} className="overflow-hidden">
            <img src={cityHero(data.city)} alt="" className="h-56 w-full object-cover sm:h-72" />
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap gap-2">
                <Badge tone={publicTrip ? 'success' : 'neutral'}>{data.visibility}</Badge>
                <Badge tone="info">{data.style}</Badge>
              </div>
              <p className="text-sm leading-6 text-ink">{data.description}</p>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Itinerary</p>
            <ol className="mt-4 space-y-4">
              {(data.itinerary ?? []).map((stop) => (
                <li key={`${stop.day}-${stop.title}`} className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-ink">
                    {stop.day}
                  </span>
                  <div>
                    <p className="font-medium text-ink">{stop.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{stop.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-4">
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

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Host</p>
            <div className="mt-3">
              <PersonChip name={data.owner} size="md" />
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Companions</p>
            {(data.companions ?? []).length > 0 ? (
              <ul className="mt-3 space-y-2.5">
                {data.companions.map((name) => (
                  <li key={name}>
                    <PersonChip name={name} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">No one has joined yet.</p>
            )}
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Admin notes</p>
            <p className="mt-3 text-sm leading-6 text-ink">{data.notes}</p>
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
