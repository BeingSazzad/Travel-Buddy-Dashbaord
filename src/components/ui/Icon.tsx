import type { LucideIcon } from 'lucide-react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  Ban,
  Bell,
  CalendarHeart,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  CreditCard,
  FileText,
  Flag,
  LayoutDashboard,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MoreHorizontal,
  Plane,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Users,
  X,
} from 'lucide-react'

export type IconName =
  | 'overview'
  | 'people'
  | 'trips'
  | 'events'
  | 'destinations'
  | 'reports'
  | 'subscriptions'
  | 'reviews'
  | 'deals'
  | 'content'
  | 'notifications'
  | 'settings'
  | 'search'
  | 'bell'
  | 'logout'
  | 'login'
  | 'mail'
  | 'lock'
  | 'plus'
  | 'more'
  | 'close'
  | 'check'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronDown'
  | 'sort'
  | 'sortAsc'
  | 'sortDesc'
  | 'arrowLeft'
  | 'arrowUp'
  | 'arrowDown'
  | 'ban'
  | 'trash'
  | 'user'
  | 'send'
  | 'sparkles'
  | 'shield'

const icons: Record<IconName, LucideIcon> = {
  overview: LayoutDashboard,
  people: Users,
  trips: Plane,
  events: CalendarHeart,
  destinations: MapPin,
  reports: Flag,
  subscriptions: CreditCard,
  reviews: Star,
  deals: Tag,
  content: FileText,
  notifications: Bell,
  settings: Settings,
  search: Search,
  bell: Bell,
  logout: LogOut,
  login: LogIn,
  mail: Mail,
  lock: Lock,
  plus: Plus,
  more: MoreHorizontal,
  close: X,
  check: Check,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  sort: ArrowUpDown,
  sortAsc: ArrowUp,
  sortDesc: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  ban: Ban,
  trash: Trash2,
  user: CircleUser,
  send: Send,
  sparkles: Sparkles,
  shield: Shield,
}

export function Icon({
  name,
  className = 'h-[18px] w-[18px]',
  strokeWidth = 1.75,
}: {
  name: IconName
  className?: string
  strokeWidth?: number
}) {
  const Cmp = icons[name]
  if (!Cmp) return null
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden />
}
