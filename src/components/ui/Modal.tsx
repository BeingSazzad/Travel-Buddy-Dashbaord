import { Button } from './Button'
import { Icon } from './Icon'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  className?: string
}

export function Modal({ open, title, children, onClose, footer, className }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <button className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div className={cn('relative w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-[0_24px_64px_rgba(13,20,37,0.18)]', className)}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" className="h-9 w-9 px-0">
            <Icon name="close" className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4 text-sm text-muted">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  )
}
