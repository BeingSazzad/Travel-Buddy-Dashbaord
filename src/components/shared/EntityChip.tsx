import { Link } from 'react-router-dom'
import { Avatar } from './Avatar'
import { Icon } from '@/components/ui/Icon'
import { personPhoto, placePhoto } from '@/lib/photos'
import { peopleStore } from '@/lib/peopleStore'
import { userPath } from '@/constants/routes'

export function PersonChip({
  id,
  name,
  to,
  size = 'sm',
  verified,
}: {
  id?: string
  name: string
  to?: string
  size?: 'sm' | 'md'
  verified?: boolean
}) {
  const resolvedId = id ?? peopleStore.list().find((p) => p.name === name)?.id
  const href = to ?? (resolvedId ? userPath(resolvedId) : undefined)
  const inner = (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <Avatar name={name} image={personPhoto(resolvedId || name)} size={size} />
      <span className="truncate font-medium text-ink">{name}</span>
      {verified ? (
        <span title="Verified" className="shrink-0 text-primary-600">
          <Icon name="shield" className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </span>
  )
  if (!href) return inner
  return (
    <Link to={href} className="min-w-0 hover:underline" onClick={(e) => e.stopPropagation()}>
      {inner}
    </Link>
  )
}

export function PlaceChip({
  title,
  subtitle,
  id,
  city,
}: {
  title: string
  subtitle?: string
  id: string
  city?: string
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <img src={placePhoto(id, city)} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
      <span className="min-w-0">
        <span className="block truncate font-medium text-ink">{title}</span>
        {subtitle ? <span className="block truncate text-xs text-muted">{subtitle}</span> : null}
      </span>
    </span>
  )
}
