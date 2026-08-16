import { PageHeader } from '@/components/layout/PageHeader'
import { BroadcastComposer } from '@/components/broadcast/BroadcastComposer'

export function BroadcastPage() {
  return (
    <div>
      <PageHeader title="Broadcast" description="Send a note to members’ Notification Center." />
      <BroadcastComposer />
    </div>
  )
}
