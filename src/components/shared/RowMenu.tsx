import { useEffect, useRef, useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Icon, menuIcon } from '@/components/ui/Icon'
import { Tooltip } from '@/components/ui/Tooltip'

export type MenuItem = {
  label: string
  onClick: () => void
  danger?: boolean
}

export function RowMenu({
  items,
  label = 'Action',
}: {
  items: MenuItem[]
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  if (items.length === 0) return null

  const only = items.length === 1 ? items[0] : null

  function place() {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return
    const width = 176
    const height = items.length * 40 + 8
    const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8)
    const below = rect.bottom + 4
    const top = below + height > window.innerHeight - 8 ? Math.max(8, rect.top - height - 4) : below
    setPos({ top, left })
  }

  function toggle(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (open) {
      setOpen(false)
      return
    }
    place()
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return
      setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    const timer = window.setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown)
    }, 0)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, items.length])

  function run(item: MenuItem, e: ReactPointerEvent | MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setOpen(false)
    item.onClick()
  }

  if (only) {
    return (
      <Tooltip content={only.label}>
        <Button variant={only.danger ? 'danger' : 'secondary'} size="sm" onClick={only.onClick}>
          <Icon name={menuIcon(only.label)} className="h-3.5 w-3.5" />
          {only.label}
        </Button>
      </Tooltip>
    )
  }

  return (
    <div className="relative inline-flex">
      <Tooltip content={label}>
        <Button
          ref={btnRef}
          variant="secondary"
          size="sm"
          onClick={toggle}
          aria-label={label}
          aria-expanded={open}
          className="h-9 w-9 rounded-lg border border-ink/30 bg-white p-0 text-ink shadow-sm hover:bg-surface"
        >
          <Icon name="more" className="h-5 w-5 text-ink" strokeWidth={2.25} />
        </Button>
      </Tooltip>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{ top: pos.top, left: pos.left }}
              className="fixed z-[80] w-44 rounded-xl border border-line bg-white py-1 shadow-lg"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium hover:bg-surface ${item.danger ? 'text-rose-600' : 'text-ink'}`}
                  onPointerDown={(e) => {
                    if (e.button !== 0) return
                    run(item, e)
                  }}
                >
                  <Icon name={menuIcon(item.label)} className="h-4 w-4 shrink-0 text-current" />
                  {item.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
