import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export function RowMenu({ items }: { items: Array<{ label: string; onClick: () => void; danger?: boolean }> }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="h-8 w-8 px-0" onClick={() => setOpen((v) => !v)} aria-label="Actions">
        <Icon name="more" className="h-4 w-4" />
      </Button>
      {open ? (
        <>
          <button className="fixed inset-0 z-10 cursor-default" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 min-w-[160px] rounded-xl border border-line bg-white p-1 shadow-lg">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`flex w-full rounded-lg px-3 py-2 text-left text-sm ${item.danger ? 'text-rose-600 hover:bg-rose-50' : 'text-ink hover:bg-surface'}`}
                onClick={() => {
                  setOpen(false)
                  item.onClick()
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
