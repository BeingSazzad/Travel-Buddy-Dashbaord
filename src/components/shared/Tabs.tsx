import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

export function Tabs({
  value,
  onChange,
  items,
  className,
}: {
  value: string
  onChange: (id: string) => void
  items: Array<{ id: string; label: string; icon?: IconName }>
  className?: string
}) {
  return (
    <div className={cn('mb-5 inline-flex flex-wrap gap-1 rounded-2xl border border-line bg-white p-1', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={
            value === item.id
              ? 'inline-flex h-9 items-center gap-1.5 rounded-xl bg-ink px-3.5 text-sm font-medium text-white shadow-sm'
              : 'inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium text-muted hover:bg-surface hover:text-ink'
          }
        >
          {item.icon ? <Icon name={item.icon} className="h-3.5 w-3.5" /> : null}
          {item.label}
        </button>
      ))}
    </div>
  )
}
