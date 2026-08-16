import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  icon?: IconName
}

export function Input({ label, error, className, id, icon, ...props }: Props) {
  const inputId = id ?? props.name
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <span className="relative block">
        {icon ? (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          />
        ) : null}
        <input
          id={inputId}
          className={cn(
            'h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10',
            icon && 'pl-10',
            error && 'border-rose-400 focus:ring-rose-100',
            className,
          )}
          {...props}
        />
      </span>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  )
}
