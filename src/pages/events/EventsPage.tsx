import { PageHeader } from '@/components/layout/PageHeader'
import { EventsTable } from '@/components/events/EventsTable'

export function EventsPage() {
  return (
    <div>
      <PageHeader title="Events" description="Meetups, RSVPs, and cancellations." />
      <EventsTable />
    </div>
  )
}
