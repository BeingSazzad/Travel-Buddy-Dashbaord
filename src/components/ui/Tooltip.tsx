import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function Tooltip({
  content,
  children,
}: {
  content: string
  children: ReactNode
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  return (
    <span
      className="inline-flex"
      onMouseEnter={(e) => {
        const box = e.currentTarget.getBoundingClientRect()
        setPos({ x: box.left + box.width / 2, y: box.top })
      }}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos
        ? createPortal(
            <span
              className="pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-full rounded-lg bg-[#1a1410] px-2.5 py-1 text-[11px] font-medium text-white shadow-[0_8px_20px_rgba(26,20,16,0.28)]"
              style={{ left: pos.x, top: pos.y - 8 }}
            >
              {content}
              <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-[#1a1410]" />
            </span>,
            document.body,
          )
        : null}
    </span>
  )
}
