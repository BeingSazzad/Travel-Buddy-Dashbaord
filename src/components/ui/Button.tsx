import { cn } from '@/lib/utils'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

type Variant = 'secondary' | 'ghost' | 'danger' | 'solid' | 'warn' | 'success'
type Size = 'sm' | 'md'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  secondary: 'bg-white text-ink border border-line hover:bg-surface',
  ghost: 'bg-transparent text-muted hover:bg-surface hover:text-ink',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  solid: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm',
  warn: 'border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100',
  success: 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-10 px-4 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'solid', size = 'md', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition duration-150 ease-out disabled:opacity-50 active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
})
