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
  const occupancyPercent = data.spots > 0 ? Math.round((data.spotsTaken / data.spots) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Controls */}
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

      {/* 4 Visual KPI Stat Cards Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 bg-gradient-to-br from-white to-primary-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Trip Dates</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
              <Icon name="events" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-sm font-bold text-ink">{formatDisplayDate(data.startDate)} – {formatDisplayDate(data.endDate)}</p>
          <p className="mt-0.5 text-xs text-muted">{stay != null ? `${stay} nights stay` : 'Flexible duration'}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Meeting Point</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Icon name="destinations" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-sm font-bold text-ink line-clamp-1">{data.meetingPoint || 'Central Square'}</p>
          <p className="mt-0.5 text-xs text-muted">📍 {data.city}, {data.country}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Spots Filled</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Icon name="people" className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-xl font-bold text-ink">{data.spotsTaken} of {data.spots} <span className="text-xs font-medium text-muted">spots taken</span></p>
            <span className="text-xs font-semibold text-emerald-700">{occupancyPercent}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${occupancyPercent}%` }} />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Est. Daily Budget</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Icon name="transactions" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-ink">{data.budgetPerDay}</p>
          <p className="mt-0.5 text-xs text-muted">Estimated per person / day</p>
        </Card>
      </div>

      {/* Main 2-Column Details Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {/* Cover Photo & Description Card */}
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
                <Badge tone="warn">{`${data.spots} Total Spots`}</Badge>
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink mb-1">About this Trip</h3>
                <p className="text-sm leading-relaxed text-ink/90">{data.description}</p>
              </div>
            </div>
          </Card>

          {/* Day-by-Day Itinerary Schedule (Real App Feature) */}
          {(data.itinerary ?? []).length > 0 ? (
            <Card>
              <div className="flex items-center justify-between border-b border-line pb-3.5 mb-5">
                <div className="flex items-center gap-2">
                  <Icon name="events" className="h-5 w-5 text-primary-600" />
                  <h3 className="font-display text-base font-semibold text-ink">Planned Itinerary & Schedule</h3>
                </div>
                <span className="text-xs font-semibold text-muted">{data.itinerary.length} Days Planned</span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
                {data.itinerary.map((stop) => (
                  <div key={stop.day} className="relative">
                    <div className="absolute -left-[19px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-primary-600 ring-2 ring-primary-100" />
                    <div>
                      <span className="inline-block rounded bg-primary-50 px-2 py-0.5 text-[11px] font-bold text-primary-700 uppercase tracking-wider mb-1">
                        Day {stop.day}
                      </span>
                      <h4 className="text-sm font-bold text-ink">{stop.title}</h4>
                      <p className="mt-1 text-xs text-muted leading-relaxed">{stop.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>

        {/* Right Sidebar Cards */}
        <div className="space-y-6">
          {/* Organised By / Host Section */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Organised by</p>
            <div className="mt-3 flex items-center justify-between">
              <PersonChip name={data.owner} size="md" />
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">Organiser (Host)</span>
            </div>
          </Card>

          {/* Confirmed Travel Companions Section */}
          <Card>
            <div className="flex items-center justify-between mb-3 border-b border-line pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Travel Companions</p>
              <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                {(data.companions ?? []).length} Joined
              </span>
            </div>
            {(data.companions ?? []).length > 0 ? (
              <ul className="space-y-3">
                {data.companions.map((name) => (
                  <li key={name} className="flex items-center justify-between">
                    <PersonChip name={name} size="md" />
                    <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">Confirmed</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted py-2">No companions have joined yet.</p>
            )}
          </Card>

          {/* Admin Metadata Card */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Admin Information</p>
            <dl className="mt-3 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-line/60">
                <dt className="text-muted">Created On</dt>
                <dd className="font-medium text-ink">{formatDisplayDate(data.createdAt)}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-line/60">
                <dt className="text-muted">Trip ID</dt>
                <dd className="font-mono text-ink">{data.id}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-muted">Feed Status</dt>
                <dd className="font-medium text-ink">{publicTrip ? 'Live in App Feed' : 'Hidden from Public Feed'}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      {/* Confirm Delete Modal */}
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
