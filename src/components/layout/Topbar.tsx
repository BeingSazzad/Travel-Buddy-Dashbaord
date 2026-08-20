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
    <header className="flex h-14 shrink-0 items-center border-b border-line/80 bg-white/80 px-10 backdrop-blur-md lg:px-14">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-end">
        <div className="flex items-center gap-2">
          <div className="relative" ref={panelRef}>
            <button
              type="button"
              aria-label={unread ? `${unread} unread notifications` : 'Notifications'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                'relative flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-surface hover:text-ink',
                open && 'bg-surface text-ink',
              )}
            >
              <Icon name="bell" className="h-4 w-4" />
              {unread ? <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary-500" /> : null}
            </button>

            {open ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[360px] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_40px_rgba(13,20,37,0.12)]">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">Notifications</p>
                    <p className="text-xs text-muted">{unread ? `${unread} unread` : 'All caught up'}</p>
                  </div>
                  {unread ? (
                    <button
                      type="button"
                      className="text-xs font-medium text-primary-700 hover:underline"
                      onClick={() => markAll()}
                    >
                      Mark all read
                    </button>
                  ) : null}
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {recent.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-muted">No notifications yet.</p>
                  ) : (
                    recent.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        className={cn(
                          'flex w-full items-start gap-3 border-b border-line/70 px-4 py-3.5 text-left last:border-0 hover:bg-surface/70',
                          n.read && 'opacity-70',
                        )}
                        onClick={() => {
                          if (!n.read) void markRead(n.id)
                        }}
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                          <Icon name="bell" className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <p className={cn('flex-1 text-sm leading-snug text-ink', n.read ? 'font-medium' : 'font-semibold')}>
                              {n.title}
                            </p>
                            {!n.read ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" /> : null}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{n.body}</p>
                          <p className="mt-1.5 text-[11px] text-muted">
                            {formatDisplayDate(n.sentAt)} · {audienceLabel(n.audience)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="border-t border-line bg-[#fafbfd] px-4 py-2.5">
                  <Link
                    to={ROUTES.notifications}
                    className="block text-center text-xs font-medium text-primary-700 hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    View all notifications
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
