import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className, padding = true }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-panel shadow-[0_10px_28px_rgba(13,20,37,0.045)]',
        padding && 'p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}
