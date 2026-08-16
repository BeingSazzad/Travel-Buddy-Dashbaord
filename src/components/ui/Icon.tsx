import type { LucideIcon } from 'lucide-react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  Ban,
  Bell,
  Bold,
  CalendarHeart,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Flag,
  Italic,
  LayoutDashboard,
  List,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  MoreHorizontal,
  Pencil,
  Plane,
  Plus,
  Save,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Underline,
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
  | 'cms'
  | 'save'
  | 'megaphone'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'list'
  | 'eye'
  | 'eyeOff'
  | 'edit'

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
  cms: FileText,
  save: Save,
  megaphone: Megaphone,
  bold: Bold,
  italic: Italic,
  underline: Underline,
  list: List,
  eye: Eye,
  eyeOff: EyeOff,
  edit: Pencil,
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

export function menuIcon(label: string): IconName {
  const l = label.toLowerCase()
  if (l.includes('view') || l.includes('open') || l.includes('review')) return 'eye'
  if (l.includes('hide') || l.includes('unfeature') || l.includes('turn off')) return 'eyeOff'
  if (l.includes('show') || l.includes('feature') || l.includes('turn on') || l.includes('public')) return 'eye'
  if (l.includes('ban')) return 'ban'
  if (l.includes('remove') || l.includes('delete')) return 'trash'
  if (l.includes('flag')) return 'reports'
  if (l.includes('edit')) return 'edit'
  if (l.includes('activate') || l.includes('resolve') || l.includes('approve') || l.includes('clear')) return 'check'
  if (l.includes('close') || l.includes('dismiss') || l.includes('cancel')) return 'close'
  return 'more'
}
