import { useEffect, useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useGetUsersQuery } from '@/services/endpoints/usersApi'
import { useGetPlansQuery } from '@/services/endpoints/plansApi'
import type { Subscriber } from '@/lib/subscribersStore'
import type { SubStatus } from '@/types/common.types'

function defaultRenews(period: 'month' | 'year') {
  const date = new Date()
  if (period === 'year') date.setFullYear(date.getFullYear() + 1)
  else date.setMonth(date.getMonth() + 1)
  return date.toISOString().slice(0, 10)
}

export function SubscriberFormModal({
  open,
  subscriber,
  takenMemberIds,
  onClose,
  onSave,
}: {
  open: boolean
  subscriber: Subscriber | null
  takenMemberIds: string[]
  onClose: () => void
  onSave: (row: Subscriber) => void
}) {
  const { data: people = [] } = useGetUsersQuery()
  const { data: plans = [] } = useGetPlansQuery()
  const livePlans = plans.filter((p) => p.active)
  const [memberId, setMemberId] = useState('')
  const [planId, setPlanId] = useState('')
  const [status, setStatus] = useState<SubStatus>('active')
  const [renews, setRenews] = useState('')

  const availablePeople = useMemo(() => {
    if (subscriber) return people
    return people.filter((p) => !takenMemberIds.includes(p.id))
  }, [people, subscriber, takenMemberIds])

  useEffect(() => {
    if (!open) return
    const firstPlan = livePlans[0]?.id ?? plans[0]?.id ?? ''
    if (subscriber) {
      setMemberId(subscriber.memberId)
      setPlanId(subscriber.planId)
      setStatus(subscriber.status)
      setRenews(subscriber.renews)
      return
    }
    setMemberId(availablePeople[0]?.id ?? '')
    setPlanId(firstPlan)
    setStatus('active')
    setRenews(defaultRenews(livePlans[0]?.period ?? 'month'))
  }, [open, subscriber, people, plans])

  const member = people.find((p) => p.id === memberId)
  const plan = plans.find((p) => p.id === planId)

  return (
    <Modal
      open={open}
      title={subscriber ? 'Edit subscriber' : 'Add subscriber'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!member || !planId}
            onClick={() => {
              if (!member) return
              onSave({
                id: subscriber?.id ?? `sub_${Date.now()}`,
                memberId: member.id,
                member: member.name,
                email: member.email,
                planId,
                status,
                renews,
              })
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-ink">
        <Select
          label="Member"
          value={memberId}
          disabled={Boolean(subscriber)}
          onChange={(e) => setMemberId(e.target.value)}
          options={availablePeople.map((p) => ({ value: p.id, label: p.name }))}
        />
        <Select
          label="Plan"
          value={planId}
          onChange={(e) => {
            const next = e.target.value
            setPlanId(next)
            const picked = plans.find((p) => p.id === next)
            if (picked && !subscriber) setRenews(defaultRenews(picked.period))
          }}
          options={(livePlans.length ? livePlans : plans).map((p) => ({ value: p.id, label: p.name }))}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as SubStatus)}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'expired', label: 'Expired' },
          ]}
        />
        <Input label="Renews" type="date" value={renews} onChange={(e) => setRenews(e.target.value)} />
        {plan ? <p className="text-xs text-muted">Billed {plan.period === 'year' ? 'yearly' : 'monthly'}.</p> : null}
      </div>
    </Modal>
  )
}
