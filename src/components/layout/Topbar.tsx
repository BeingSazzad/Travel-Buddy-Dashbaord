import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { Avatar } from '@/components/shared/Avatar'
import { personPhoto } from '@/lib/photos'
import {
  useGetNotificationsQuery,
  useMarkAllReadMutation,
  useMarkReadMutation,
} from '@/services/endpoints/notificationsApi'
import { useAppSelector } from '@/store/hooks'
import { ROUTES } from '@/constants/routes'
import { audienceLabel, cn, formatDisplayDate } from '@/lib/utils'

export function Topbar() {
  const user = useAppSelector((s) => s.auth.user)
  const { data = [] } = useGetNotificationsQuery()
  const [markRead] = useMarkReadMutation()
  const [markAll] = useMarkAllReadMutation()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const unread = data.filter((n) => !n.read).length
  const recent = data.slice(0, 6)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (panelRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="relative z-50 flex h-14 shrink-0 items-center border-b border-line/80 bg-white/80 px-10 backdrop-blur-md lg:px-14">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-end">
        <div className="flex items-center gap-2">
          <div className="relative" ref={panelRef}>
            <button
              type="button"
              aria-label={unread ? `${unread} unread notifications` : 'Notifications'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                'relative flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface hover:text-ink',
                open && 'bg-surface text-ink',
              )}
            >
              <Icon name="bell" className="h-4 w-4" />
              {unread ? (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
                </span>
              ) : null}
            </button>

            {open ? (
              <div className="absolute -right-2 sm:right-0 top-full mt-2.5 z-[100] w-[340px] sm:w-[380px] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_48px_rgba(15,23,42,0.15)] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-line bg-surface/50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">Notifications</p>
                    {unread > 0 ? (
                      <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                        {unread} new
                      </span>
                    ) : null}
                  </div>
                  {unread ? (
                    <button
                      type="button"
                      className="text-xs font-medium text-primary-700 transition-colors hover:text-primary-800 hover:underline"
                      onClick={() => markAll()}
                    >
                      Mark all read
                    </button>
                  ) : null}
                </div>

                <div className="max-h-[380px] overflow-y-auto divide-y divide-line/60">
                  {recent.length === 0 ? (
                    <div className="px-4 py-12 text-center">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted">
                        <Icon name="bell" className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-ink">All caught up!</p>
                      <p className="mt-0.5 text-xs text-muted">No new notifications at this time.</p>
                    </div>
                  ) : (
                    recent.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        className={cn(
                          'flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface/70',
                          n.read ? 'bg-white opacity-75' : 'bg-primary-50/20',
                        )}
                        onClick={() => {
                          if (!n.read) void markRead(n.id)
                        }}
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                          <Icon name="bell" className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn('text-sm leading-snug text-ink min-w-0 truncate', n.read ? 'font-medium' : 'font-semibold')}>
                              {n.title}
                            </p>
                            {!n.read ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500" /> : null}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{n.body}</p>
                          <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                            <span>{formatDisplayDate(n.sentAt)}</span>
                            <span className="rounded-md bg-surface px-1.5 py-0.5 font-medium">{audienceLabel(n.audience)}</span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="border-t border-line bg-surface/50 px-4 py-2.5">
                  <Link
                    to={ROUTES.notifications}
                    className="block text-center text-xs font-semibold text-primary-700 hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          <Link to={ROUTES.settings} aria-label="Open profile settings">
            <Avatar name={user?.name ?? 'Admin'} image={user?.avatar || personPhoto(user?.id ?? 'admin')} />
          </Link>
        </div>
      </div>
    </header>
  )
}
