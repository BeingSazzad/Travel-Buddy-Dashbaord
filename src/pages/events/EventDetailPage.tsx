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

  return (
    <div>
      <Link to={ROUTES.events} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <Icon name="arrowLeft" className="h-4 w-4" />
        Events
      </Link>
      <PageHeader
        title={data.title}
        description={`${data.city}, ${data.country} · ${formatDisplayDate(data.date)} · ${data.time}`}
        action={
          <>
            {canCancel ? (
              <Button variant="secondary" size="sm" onClick={() => setConfirmCancel(true)}>
                Cancel event
              </Button>
            ) : null}
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
                <Badge tone={tone(data.status)}>{data.status}</Badge>
                <Badge tone="neutral">{`${data.attendees} RSVPs`}</Badge>
              </div>
              <p className="text-sm leading-6 text-ink">{data.description}</p>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Agenda</p>
            <ol className="mt-4 space-y-4">
              {(data.agenda ?? []).map((stop) => (
                <li key={`${stop.time}-${stop.title}`} className="flex gap-3">
                  <span className="mt-0.5 w-14 shrink-0 text-xs font-semibold text-muted">{stop.time}</span>
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
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Event details</p>
            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-sm text-muted">When</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {formatDisplayDate(data.date)} · {data.time}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Venue</dt>
                <dd className="mt-0.5 font-medium text-ink">{data.venue}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">RSVPs</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {data.attendees} of {data.capacity} spots
                </dd>
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
              <PersonChip name={data.host} size="md" />
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Guests</p>
            {(data.guests ?? []).length > 0 ? (
              <ul className="mt-3 space-y-2.5">
                {data.guests.map((name) => (
                  <li key={name}>
                    <PersonChip name={name} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">No named guests yet.</p>
            )}
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Admin notes</p>
            <p className="mt-3 text-sm leading-6 text-ink">{data.notes}</p>
          </Card>
        </div>
      </div>

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
