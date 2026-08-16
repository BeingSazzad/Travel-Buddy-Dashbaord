import { NavLink } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { Avatar } from '@/components/shared/Avatar'
import { useGetNotificationsQuery } from '@/services/endpoints/notificationsApi'
import { useAppSelector } from '@/store/hooks'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

export function Topbar() {
  const user = useAppSelector((s) => s.auth.user)
  const { data = [] } = useGetNotificationsQuery()
  const unread = data.filter((n) => !n.read).length

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-line/80 bg-white/80 px-10 backdrop-blur-md lg:px-14">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-end">
        <div className="flex items-center gap-2">
          <NavLink
            to={ROUTES.notifications}
            aria-label={unread ? `${unread} unread notifications` : 'Notifications'}
            className={({ isActive }) =>
              cn(
                'relative flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-surface hover:text-ink',
                isActive && 'bg-surface text-ink',
              )
            }
          >
            <Icon name="bell" className="h-4 w-4" />
            {unread ? <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary-500" /> : null}
          </NavLink>
          <NavLink to={ROUTES.settings} aria-label="Open profile settings">
            <Avatar name={user?.name ?? 'Admin'} image={user?.avatar} />
          </NavLink>
        </div>
      </div>
    </header>
  )
}
