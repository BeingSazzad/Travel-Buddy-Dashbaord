import { cn } from '@/lib/utils'
import type { TextareaHTMLAttributes } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  hint?: string
}

export function Textarea({ label, hint, className, ...props }: Props) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <textarea
        className={cn(
          'min-h-[96px] w-full resize-y rounded-xl border border-line bg-white px-3.5 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-muted/70 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10',
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  )
}
