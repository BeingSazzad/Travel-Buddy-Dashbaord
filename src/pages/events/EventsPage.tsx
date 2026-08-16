import { PageHeader } from '@/components/layout/PageHeader'
import { EventsTable } from '@/components/events/EventsTable'

export function EventsPage() {
  return (
    <div>
      <PageHeader title="Events" description="Hosted meetups and RSVP activity." />
      <EventsTable />
    </div>
  )
}
