import { cn } from '@/lib/utils'

export function Avatar({
  name,
  image,
  size = 'md',
}: {
  name: string
  image?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
  const box = size === 'lg' ? 'h-16 w-16 text-lg' : size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs'
  if (image) {
    return <img src={image} alt={name} className={cn('rounded-full object-cover', box)} />
  }
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full bg-primary-100 font-display font-semibold text-primary-800', box)}>
      {initials}
    </span>
  )
}
