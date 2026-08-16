import { cn } from '@/lib/utils'

export function BrandLogo({
  size = 'md',
  tone = 'light',
  className,
}: {
  size?: 'sm' | 'md'
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'flex items-center justify-center rounded-lg font-display font-semibold',
          size === 'sm' ? 'h-8 w-8 text-sm' : 'h-10 w-10 text-base',
          tone === 'light' ? 'bg-white/20 text-white' : 'bg-primary-500 text-white',
        )}
      >
        S
      </span>
      <span className={cn('font-display font-semibold tracking-[0.14em]', size === 'sm' ? 'text-sm' : 'text-base', tone === 'light' ? 'text-white' : 'text-ink')}>
        SELUNA
      </span>
    </div>
  )
}
