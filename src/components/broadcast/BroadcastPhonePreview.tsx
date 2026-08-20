import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { BroadcastAudience } from '@/lib/broadcastsStore'
import { audienceLabel } from '@/lib/utils'

export function BroadcastPhonePreview({
  title,
  body,
  audience,
}: {
  title: string
  body: string
  audience: BroadcastAudience
}) {
  const [viewMode, setViewMode] = useState<'push' | 'inapp'>('push')

  const previewTitle = title.trim() || 'Announcement title'
  const previewBody = body.trim() || 'Your message preview will appear here live as you type…'
  const isPlaceholder = !title.trim()

  return (
    <div className="xl:sticky xl:top-6 flex flex-col items-center">
      {/* View Mode Toggle Switch */}
      <div className="mb-4 inline-flex items-center rounded-xl bg-surface p-1 border border-line shadow-xs">
        <button
          type="button"
          onClick={() => setViewMode('push')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            viewMode === 'push'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
        >
          <span>📱 Push Alert</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('inapp')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            viewMode === 'inapp'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
        >
          <span>🔔 In-App Center</span>
        </button>
      </div>

      <div className="w-[300px]">
        {/* Device Frame */}
        <div className="relative rounded-[2.5rem] bg-slate-900 p-3 shadow-[0_25px_60px_rgba(15,23,42,0.35)] ring-1 ring-slate-800">
          {/* Dynamic Island / Camera Notch */}
          <div className="absolute left-1/2 top-[18px] z-20 h-[20px] w-[86px] -translate-x-1/2 rounded-full bg-black flex items-center justify-end px-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-800 ring-1 ring-slate-700" />
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 min-h-[500px] text-white flex flex-col justify-between">
            {/* Status Bar */}
            <div className="flex h-11 items-end justify-between px-7 pb-1 text-[11px] font-semibold text-white/90 z-10">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold">5G</span>
                <span className="h-3 w-5 rounded-[3px] border border-white/80 p-0.5 flex items-center">
                  <span className="h-full w-full bg-white rounded-[1px]" />
                </span>
              </div>
            </div>

            {/* PREVIEW MODE 1: Lock Screen Push Notification */}
            {viewMode === 'push' ? (
              <div className="flex-1 px-4 pt-10 pb-6 flex flex-col justify-start">
                <div className="text-center my-6">
                  <p className="text-4xl font-extralight tracking-tight text-white">9:41</p>
                  <p className="text-xs font-medium text-white/70 mt-1">Thursday, August 20</p>
                </div>

                {/* Push Notification Card */}
                <div className="mt-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 p-3.5 backdrop-blur-xl shadow-lg transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary-600 text-white text-[10px] font-bold">
                        S
                      </div>
                      <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Seluna</span>
                    </div>
                    <span className="text-[10px] text-white/50">now</span>
                  </div>

                  <p className={`text-sm font-semibold leading-snug ${isPlaceholder ? 'text-white/50 italic' : 'text-white'}`}>
                    {previewTitle}
                  </p>
                  <p className={`mt-1 text-xs leading-relaxed ${isPlaceholder ? 'text-white/40 italic' : 'text-white/80'} line-clamp-3`}>
                    {previewBody}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/70">
                      Target: {audienceLabel(audience)}
                    </span>
                    <span className="text-[10px] text-primary-400 font-medium">Tap to view</span>
                  </div>
                </div>
              </div>
            ) : (
              /* PREVIEW MODE 2: In-App Notification Center */
              <div className="flex-1 bg-surface text-ink flex flex-col">
                <div className="flex items-center justify-between border-b border-line px-4 pb-3 pt-2 bg-white">
                  <div className="flex items-center gap-2">
                    <Icon name="arrowLeft" className="h-4 w-4 text-ink" />
                    <span className="text-sm font-bold text-ink">Notification Center</span>
                  </div>
                  <span className="text-xs text-primary-700 font-medium">Mark all read</span>
                </div>

                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                  {/* Live Broadcast Item */}
                  <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-3 shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
                        <Icon name="megaphone" className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary-800">Admin Announcement</span>
                          <span className="h-2 w-2 rounded-full bg-primary-600" />
                        </div>
                        <p className={`mt-0.5 text-xs ${isPlaceholder ? 'font-normal text-muted italic' : 'font-semibold text-ink'}`}>
                          {previewTitle}
                        </p>
                        <p className={`mt-1 text-xs leading-normal ${isPlaceholder ? 'text-muted/70 italic' : 'text-muted'} line-clamp-2`}>
                          {previewBody}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                          <span>Just now</span>
                          <span className="rounded bg-white px-1.5 py-0.5 font-medium border border-line">{audienceLabel(audience)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Previous dummy notification */}
                  <div className="rounded-xl border border-line bg-white p-3 opacity-60">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <Icon name="trips" className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-ink">Trip Companion Match</p>
                        <p className="text-[11px] text-muted line-clamp-1 mt-0.5">Maya joined your Bali Expedition trip</p>
                        <p className="text-[10px] text-muted/70 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Home Indicator */}
            <div className="flex justify-center pb-2 pt-1 bg-transparent">
              <span className="h-1 w-28 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs font-medium text-muted">
        Live mockup of broadcast delivery to members
      </p>
    </div>
  )
}
