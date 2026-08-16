import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/shared/Badge'
import { Icon } from '@/components/ui/Icon'
import { formatEur } from '@/lib/utils'
import { PlanFormModal } from '@/components/subscriptions/PlanFormModal'
import { ConfirmAction } from '@/components/shared/ConfirmAction'
import { useGetPlansQuery, useRemovePlanMutation, useSavePlanMutation } from '@/services/endpoints/plansApi'
import { useGetSubscribersQuery } from '@/services/endpoints/subscriptionsApi'
import type { Plan } from '@/lib/plansStore'

export function PlansBoard() {
  const { data = [] } = useGetPlansQuery()
  const { data: subscribers = [] } = useGetSubscribersQuery()
  const [save] = useSavePlanMutation()
  const [remove] = useRemovePlanMutation()
  const [editing, setEditing] = useState<Plan | null | 'new'>(null)
  const [dropping, setDropping] = useState<Plan | null>(null)

  return (
    <Card padding={false}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        <p className="text-sm text-muted">
          {data.length} {data.length === 1 ? 'plan' : 'plans'} members can buy in the app
        </p>
        <Button size="sm" onClick={() => setEditing('new')}>
          <Icon name="plus" className="h-4 w-4" />
          Add plan
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="px-6 py-16 text-center text-sm text-muted">No plans yet. Add a monthly or yearly plan.</p>
      ) : (
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
          {data.map((plan) => {
            const count = subscribers.filter((s) => s.planId === plan.id && s.status === 'active').length
            return (
              <div key={plan.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">{plan.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {plan.blurb || (plan.period === 'year' ? 'Billed yearly' : 'Billed monthly')}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1">
                    {plan.badge ? <Badge tone="info">{plan.badge}</Badge> : null}
                    <Badge tone={plan.active ? 'success' : 'neutral'}>{plan.active ? 'Live' : 'Hidden'}</Badge>
                  </div>
                </div>
                <p className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink">{formatEur(plan.price)}</p>
                <p className="text-xs text-muted">
                  per {plan.period} · {count} active subscriber{count === 1 ? '' : 's'}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-ink">
                  {plan.benefits.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex gap-2">
                  <Button className="flex-1" variant="secondary" onClick={() => setEditing(plan)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => setDropping(plan)}>
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <PlanFormModal
        open={editing !== null}
        plan={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        onSave={(row) => {
          void save(row)
          setEditing(null)
        }}
      />

      <ConfirmAction
        open={Boolean(dropping)}
        title="Remove this plan?"
        body="Members on this plan stay as subscribers, but the plan will no longer appear in the app."
        confirmLabel="Remove"
        danger
        onClose={() => setDropping(null)}
        onConfirm={() => {
          if (dropping) void remove(dropping.id)
          setDropping(null)
        }}
      />
    </Card>
  )
}
