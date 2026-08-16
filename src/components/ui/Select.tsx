import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'
import type { SelectHTMLAttributes } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  options: Array<{ value: string; label: string }>
}

export function Select({ label, options, className, ...props }: Props) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <span className="relative block">
        <select
          className={cn(
            'h-11 w-full appearance-none rounded-xl border border-line bg-white bg-none py-0 pl-3.5 pr-10 text-sm leading-none text-ink outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center">
          <Icon name="chevronDown" className="h-4 w-4 text-ink" />
        </span>
      </span>
    </label>
  )
}
