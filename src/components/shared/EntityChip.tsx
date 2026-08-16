import { Avatar } from './Avatar'

export function PersonChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Avatar name={name} size="sm" />
      <span className="font-medium">{name}</span>
    </span>
  )
}
