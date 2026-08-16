import { cn } from '@/lib/utils'
import { Sparkline } from './Sparkline'
import { Icon } from './Icon'

type Props = {
  label: string
  value: string
  delta?: number
  hint?: string
  spark?: number[]
}

export function KpiCard({ label, value, delta, hint, spark }: Props) {
  const up = (delta ?? 0) >= 0
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_10px_28px_rgba(44,34,23,0.045)]">
      <p className="text-xs font-medium text-muted">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-display text-[28px] font-semibold leading-none tracking-tight text-ink">{value}</p>
        {spark ? <Sparkline values={spark} className="mb-0.5 h-9 w-[88px]" /> : null}
      </div>
      {delta !== undefined || hint ? (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta !== undefined ? (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 font-semibold',
                up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
              )}
            >
              <Icon name={up ? 'arrowUp' : 'arrowDown'} className="mr-0.5 h-3 w-3" />
              {Math.abs(delta)}%
            </span>
          ) : null}
          {hint ? <span className="text-muted">{hint}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
