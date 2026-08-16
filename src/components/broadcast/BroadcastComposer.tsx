import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/shared/Badge'
import { Icon } from '@/components/ui/Icon'
import { audienceLabel, formatDisplayDate } from '@/lib/utils'
import { BroadcastPhonePreview } from '@/components/broadcast/BroadcastPhonePreview'
import { useGetBroadcastsQuery, useSendBroadcastMutation } from '@/services/endpoints/broadcastsApi'
import type { BroadcastAudience } from '@/lib/broadcastsStore'

export function BroadcastComposer() {
  const { data = [] } = useGetBroadcastsQuery()
  const [send, { isLoading }] = useSendBroadcastMutation()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState<BroadcastAudience>('all')
  const [result, setResult] = useState('')

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
      <div className="space-y-6">
        <Card>
          <div className="mb-5 flex items-center gap-2 text-primary-700">
            <Icon name="megaphone" className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">Broadcast</p>
          </div>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              const res = await send({ title, body, audience })
              if ('data' in res && res.data) {
                setResult(`Sent to ${res.data.sent} members.`)
                setTitle('')
                setBody('')
              }
            }}
          >
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" required />
            <Textarea label="Message" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message…" />
            <Select
              label="Audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value as BroadcastAudience)}
              options={[
                { value: 'all', label: 'All members' },
                { value: 'subscribers', label: 'Subscribers only' },
              ]}
            />
            <Button type="submit" className="w-full" disabled={isLoading || !title.trim()}>
              <Icon name="send" className="h-4 w-4" />
              {isLoading ? 'Sending…' : 'Send to members'}
            </Button>
            {result ? <p className="text-center text-xs text-muted">{result}</p> : null}
            <p className="text-center text-xs text-muted">Each member receives this in Notification Center (demo).</p>
          </form>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-ink">Recent broadcasts</p>
          <div className="mt-4 space-y-3">
            {data.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">No broadcasts yet. Send one to see it here.</p>
            ) : (
              data.map((item) => (
                <div key={item.id} className="rounded-xl border border-line px-3 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-ink">{item.title}</p>
                    <Badge tone="info">{audienceLabel(item.audience)}</Badge>
                  </div>
                  {item.body ? <p className="mt-1 text-sm text-muted">{item.body}</p> : null}
                  <p className="mt-2 text-xs text-muted">
                    {formatDisplayDate(item.sentAt)} · {item.sent} sent
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <BroadcastPhonePreview title={title} body={body} audience={audience} />
    </div>
  )
}
