import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/shared/Badge'
import { PersonChip } from '@/components/shared/EntityChip'
import { reportsStore } from '@/lib/reportsStore'
import { eventsStore } from '@/lib/eventsStore'

export function QueueBoard() {
  const pending = reportsStore.list().filter((r) => r.status === 'pending' || r.status === 'reviewing')
  const upcoming = eventsStore.list().filter((e) => e.status === 'upcoming').slice(0, 3)

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <p className="text-sm font-semibold text-ink">Safety queue</p>
        <p className="mt-1 text-xs text-muted">Reports that need a decision</p>
        <div className="mt-4 space-y-3">
          {pending.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">{r.target}</p>
                <p className="text-xs text-muted">{r.reason}</p>
              </div>
              <Badge tone={r.status === 'pending' ? 'warn' : 'info'}>{r.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <p className="text-sm font-semibold text-ink">Upcoming meetups</p>
        <p className="mt-1 text-xs text-muted">Live community calendar</p>
        <div className="mt-4 space-y-3">
          {upcoming.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">{e.title}</p>
                <p className="text-xs text-muted">{e.city} · {e.date}</p>
              </div>
              <PersonChip name={e.host} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
