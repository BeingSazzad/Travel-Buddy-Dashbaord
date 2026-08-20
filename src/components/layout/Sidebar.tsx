import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { Icon, type IconName } from '@/components/ui/Icon'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { useAppDispatch } from '@/store/hooks'
import { setUser } from '@/components/auth/authSlice'
import { useLogoutMutation } from '@/services/endpoints/authApi'

type NavItem = {
  to: string
  label: string
  icon: IconName
  end?: boolean
}

const groups: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Home',
    items: [{ to: ROUTES.dashboard, label: 'Dashboard', icon: 'overview', end: true }],
  },
  {
    title: 'Community',
    items: [
      { to: ROUTES.users, label: 'Members', icon: 'people' },
      { to: ROUTES.trips, label: 'Trips', icon: 'trips' },
      { to: ROUTES.events, label: 'Events', icon: 'events' },
      { to: ROUTES.reports, label: 'Reports', icon: 'reports' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { to: ROUTES.destinations, label: 'Destinations', icon: 'destinations' },
      { to: ROUTES.deals, label: 'Deals', icon: 'deals' },
      { to: ROUTES.reviews, label: 'Reviews', icon: 'reviews' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { to: ROUTES.subscriptions, label: 'Subscriptions', icon: 'subscriptions' },
      { to: ROUTES.subscribers, label: 'Subscribers', icon: 'user' },
      { to: ROUTES.transactions, label: 'Transactions', icon: 'transactions' },
      { to: ROUTES.cms, label: 'CMS', icon: 'cms' },
      { to: ROUTES.broadcast, label: 'Broadcast', icon: 'megaphone' },
      { to: ROUTES.notifications, label: 'Notifications', icon: 'notifications' },
      { to: ROUTES.settings, label: 'Settings', icon: 'settings' },
    ],
  },
]

export function Sidebar() {
  const dispatch = useAppDispatch()
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()

  return (
    <aside className="sidebar-shell flex h-full w-60 shrink-0 flex-col text-white">
      <div className="px-4 pb-4 pt-5">
        <BrandLogo size="sm" />
        <p className="mt-1.5 px-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/55">
          Admin Dashboard
        </p>
      </div>
      <div className="mx-5 mb-3 h-px bg-white/20" />
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {groups.map((group) => (
          <div key={group.title} className="mb-4">
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
              {group.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition duration-150',
                      isActive ? 'sidebar-nav-active text-white' : 'sidebar-nav-idle text-white/75',
                    )
                  }
                >
                  <Icon name={item.icon} className="h-4 w-4 opacity-90" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto border-t border-white/15 p-3">
        <button
          type="button"
          onClick={async () => {
            await logout()
            dispatch(setUser(null))
            navigate(ROUTES.login)
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[13px] font-semibold text-primary-800 hover:bg-white/90"
        >
          <Icon name="logout" className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
