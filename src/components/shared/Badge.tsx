import { cn, labelize } from '@/lib/utils'

type Tone = 'neutral' | 'success' | 'warn' | 'danger' | 'info'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface text-muted ring-1 ring-line',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  warn: 'bg-amber-50 text-amber-800 ring-1 ring-amber-100',
  danger: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  info: 'bg-primary-50 text-primary-800 ring-1 ring-primary-100',
}

export function Badge({ children, tone = 'neutral' }: { children: string | null | undefined; tone?: Tone }) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.01em]', tones[tone])}>
      {labelize(children)}
    </span>
  )
}
