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
import type { Meetup } from '@/lib/eventsStore'
import {
  useDeleteEventMutation,
  useGetEventQuery,
  useSetEventStatusMutation,
} from '@/services/endpoints/eventsApi'

function tone(s: Meetup['status']) {
  if (s === 'upcoming') return 'info' as const
  if (s === 'live') return 'success' as const
  if (s === 'cancelled') return 'danger' as const
  return 'neutral' as const
}

export function EventDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data } = useGetEventQuery(id)
  const [setEventStatus] = useSetEventStatusMutation()
  const [deleteEvent] = useDeleteEventMutation()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!data) {
    return (
      <div>
        <PageHeader title="Event not found" description="This event is not in the demo data." />
        <Link to={ROUTES.events} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700">
          <Icon name="arrowLeft" className="h-4 w-4" />
          Back to events
        </Link>
      </div>
    )
  }

  const canCancel = data.status === 'upcoming' || data.status === 'live'
  const occupancyPercent = data.capacity > 0 ? Math.round((data.attendees / data.capacity) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Navigation & Action Controls */}
      <div className="flex items-center justify-between">
        <Link to={ROUTES.events} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <Icon name="arrowLeft" className="h-4 w-4" />
          Back to Events
        </Link>
        <div className="flex items-center gap-2">
          {canCancel ? (
            <Button variant="secondary" size="sm" onClick={() => setConfirmCancel(true)}>
              Cancel event
            </Button>
          ) : null}
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        </div>
      </div>

      <PageHeader
        title={data.title}
        description={`${data.city}, ${data.country} · ${formatDisplayDate(data.date)} at ${data.time}`}
      />

      {/* 1. HERO COVER PICTURE CARD (PICTURE FIRST!) */}
      <Card padding={false} className="overflow-hidden">
        <img
          src={cityHero(data.city)}
          alt={data.title}
          className="h-64 w-full object-cover sm:h-80 bg-slate-200"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
          }}
        />
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone={tone(data.status)}>{data.status.toUpperCase()}</Badge>
            <Badge tone="info">{`${data.attendees} RSVPs`}</Badge>
            <Badge tone="neutral">{`${data.capacity} Capacity`}</Badge>
          </div>
          <div>
            <h3 className="text-base font-semibold text-ink mb-1">What we'll do</h3>
            <p className="text-sm leading-relaxed text-ink/90">{data.description}</p>
          </div>
        </div>
      </Card>

      {/* 2. 4 VISUAL KPI STAT CARDS BAR */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 bg-gradient-to-br from-white to-primary-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Event Date</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
              <Icon name="events" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-sm font-bold text-ink">{formatDisplayDate(data.date)} at {data.time}</p>
          <p className="mt-0.5 text-xs text-muted">Local Event Time</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Venue & Location</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Icon name="destinations" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-sm font-bold text-ink line-clamp-1">{data.venue}</p>
          <p className="mt-0.5 text-xs text-muted">📍 {data.city}, {data.country}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">RSVPs & Capacity</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Icon name="people" className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-xl font-bold text-ink">{data.attendees} of {data.capacity} <span className="text-xs font-medium text-muted">spots filled</span></p>
            <span className="text-xs font-semibold text-emerald-700">{occupancyPercent}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${occupancyPercent}%` }} />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Host</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Icon name="user" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-sm font-bold text-ink">{data.host}</p>
          <p className="mt-0.5 text-xs text-muted">Event Organiser</p>
        </Card>
      </div>

      {/* 3. DETAILS GRID */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left Column Cards */}
        <div className="space-y-6">
          {/* Organised By / Host Card */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Organised by</p>
            <div className="mt-3 flex items-center justify-between">
              <PersonChip name={data.host} size="md" />
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">Organiser (Host)</span>
            </div>
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
                <dt className="text-muted">Event ID</dt>
                <dd className="font-mono text-ink">{data.id}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-muted">Fill Status</dt>
                <dd className="font-medium text-ink">{occupancyPercent}% Capacity</dd>
              </div>
            </dl>
          </Card>
        </div>

        {/* Right Column Cards */}
        <div className="space-y-6">
          {/* Confirmed Attendees Section */}
          <Card>
            <div className="flex items-center justify-between mb-3 border-b border-line pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Confirmed Attendees</p>
              <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                {(data.guests ?? []).length} Attending
              </span>
            </div>
            {(data.guests ?? []).length > 0 ? (
              <ul className="space-y-3">
                {data.guests.map((name) => (
                  <li key={name} className="flex items-center justify-between">
                    <PersonChip name={name} size="md" />
                    <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">Attending</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted py-2">No confirmed guests yet.</p>
            )}
          </Card>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmAction
        open={confirmCancel}
        title="Cancel this event?"
        body={`${data.title} will be marked cancelled. Members who RSVP’d will still see it as cancelled.`}
        confirmLabel="Cancel event"
        danger
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => {
          void setEventStatus({ id: data.id, status: 'cancelled' })
          setConfirmCancel(false)
        }}
      />
      <ConfirmAction
        open={confirmDelete}
        title="Delete this event?"
        body={`${data.title} will be removed from the admin list. This demo delete cannot be undone.`}
        confirmLabel="Delete"
        danger
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          void deleteEvent(data.id).then(() => navigate(ROUTES.events))
          setConfirmDelete(false)
        }}
      />
    </div>
  )
}
