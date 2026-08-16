import { Icon } from '@/components/ui/Icon'
import type { BroadcastAudience } from '@/lib/broadcastsStore'

export function BroadcastPhonePreview({
  title,
  body,
  audience,
}: {
  title: string
  body: string
  audience: BroadcastAudience
}) {
  const previewTitle = title.trim() || 'Announcement title'
  const previewBody = body.trim() || 'Your message will appear here in Notification Center.'
  const placeholder = !title.trim()

  return (
    <div className="xl:sticky xl:top-6">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted">Live preview</p>
      <div className="mx-auto w-[280px]">
        <div className="relative rounded-[2.15rem] bg-[#1a1410] p-[10px] shadow-[0_24px_50px_rgba(26,20,16,0.28)]">
          <div className="absolute left-1/2 top-[18px] z-10 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
          <div className="overflow-hidden rounded-[1.7rem] bg-[#faf7f3]">
            <div className="flex h-[44px] items-end justify-between px-6 pb-1.5 text-[10px] font-semibold text-[#1c2434]">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-4 rounded-[1px] bg-[#1c2434]/80" />
                <span className="h-2.5 w-4 rounded-sm border border-[#1c2434]/80" />
              </span>
            </div>

            <div className="flex items-center justify-between px-3 pb-2 pt-1">
              <div className="flex items-center gap-1.5">
                <Icon name="arrowLeft" className="h-4 w-4 text-[#1c2434]" />
                <p className="font-display text-[15px] font-semibold tracking-tight text-[#1c2434]">Notifications</p>
              </div>
              <span className="text-[10px] font-medium text-[#9d8058]">Mark all read</span>
            </div>

            <div className="min-h-[420px] px-3 pb-6">
              <div className="flex items-start gap-3 border-b border-[#e8e2da] py-3.5">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9d8058]/12">
                  <Icon name="shield" className="h-4 w-4 text-[#9d8058]" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-start gap-2">
                    <p className={`flex-1 text-[13px] leading-snug text-[#1c2434] ${placeholder ? 'font-medium text-[#9a9188]' : 'font-semibold'}`}>
                      {previewTitle}
                    </p>
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#9d8058]" />
                  </div>
                  <p className={`mt-1 line-clamp-3 text-[12px] leading-relaxed ${placeholder ? 'text-[#b3aba3]' : 'text-[#6b645c]'}`}>
                    {previewBody}
                  </p>
                  <p className="mt-1.5 text-[10px] text-[#9a9188]">Just now · {audience === 'subscribers' ? 'Subscribers' : 'All members'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-3.5 opacity-45">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9d8058]/12">
                  <Icon name="sparkles" className="h-4 w-4 text-[#9d8058]" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[13px] font-medium leading-snug text-[#1c2434]">New match with Maya</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#6b645c]">Also travelling to Bali in August.</p>
                  <p className="mt-1.5 text-[10px] text-[#9a9188]">30m ago</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pb-2.5 pt-1">
              <span className="h-1 w-24 rounded-full bg-[#1a1410]/20" />
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted">As it appears in the Seluna app</p>
    </div>
  )
}
