import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { BillingPeriod, Plan } from '@/lib/plansStore'

const EMPTY: Omit<Plan, 'id'> = {
  name: '',
  price: 5.29,
  period: 'month',
  badge: '',
  blurb: '',
  featured: false,
  active: true,
  benefits: [],
}

export function PlanFormModal({
  open,
  plan,
  onClose,
  onSave,
}: {
  open: boolean
  plan: Plan | null
  onClose: () => void
  onSave: (plan: Plan) => void
}) {
  const [draft, setDraft] = useState(EMPTY)

  useEffect(() => {
    if (!open) return
    setDraft(
      plan
        ? {
            name: plan.name,
            price: plan.price,
            period: plan.period,
            badge: plan.badge,
            blurb: plan.blurb,
            featured: plan.featured,
            active: plan.active,
            benefits: plan.benefits,
          }
        : EMPTY,
    )
  }, [open, plan])

  return (
    <Modal
      open={open}
      title={plan ? 'Edit plan' : 'New plan'}
      onClose={onClose}
      className="max-w-lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!draft.name.trim()) return
              onSave({
                id: plan?.id ?? `plan_${Date.now()}`,
                ...draft,
                name: draft.name.trim(),
                badge: draft.badge.trim(),
                blurb: draft.blurb.trim(),
                benefits: draft.benefits.map((line) => line.trim()).filter(Boolean),
              })
            }}
          >
            Save plan
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-ink">
        <Input label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Monthly" required />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price (€)"
            type="number"
            min="0"
            step="0.01"
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
          />
          <Select
            label="Billed"
            value={draft.period}
            onChange={(e) => setDraft({ ...draft, period: e.target.value as BillingPeriod })}
            options={[
              { value: 'month', label: 'Every month' },
              { value: 'year', label: 'Every year' },
            ]}
          />
        </div>
        <Input label="Badge" value={draft.badge} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} placeholder="Save 30%" />
        <Input label="Short line" value={draft.blurb} onChange={(e) => setDraft({ ...draft, blurb: e.target.value })} placeholder="Billed monthly" />
        <Textarea
          label="What’s included"
          value={draft.benefits.join('\n')}
          onChange={(e) => setDraft({ ...draft, benefits: e.target.value.split('\n') })}
          placeholder="One perk per line"
        />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
          Visible in the app
        </label>
      </div>
    </Modal>
  )
}
