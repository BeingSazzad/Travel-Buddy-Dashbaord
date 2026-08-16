import { useEffect, useRef } from 'react'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/utils'

type Props = {
  label?: string
  value: string
  onChange: (html: string) => void
  className?: string
}

function toHtml(value: string) {
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return value
  return value
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

export function TextEditor({ label, value, onChange, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || document.activeElement === el) return
    const next = toHtml(value)
    if (el.innerHTML !== next) el.innerHTML = next
  }, [value])

  function run(command: string) {
    ref.current?.focus()
    document.execCommand(command, false)
    onChange(ref.current?.innerHTML ?? '')
  }

  const tools: Array<{ cmd: string; icon: IconName; label: string }> = [
    { cmd: 'bold', icon: 'bold', label: 'Bold' },
    { cmd: 'italic', icon: 'italic', label: 'Italic' },
    { cmd: 'underline', icon: 'underline', label: 'Underline' },
    { cmd: 'insertUnorderedList', icon: 'list', label: 'List' },
  ]

  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <div className="overflow-hidden rounded-xl border border-line bg-white focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/10">
        <div className="flex items-center gap-0.5 border-b border-line bg-surface/70 px-2 py-1.5">
          {tools.map((tool) => (
            <button
              key={tool.cmd}
              type="button"
              title={tool.label}
              aria-label={tool.label}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-ink"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(tool.cmd)}
            >
              <Icon name={tool.icon} className="h-4 w-4" />
            </button>
          ))}
        </div>
        <div
          ref={ref}
          role="textbox"
          contentEditable
          suppressContentEditableWarning
          className={cn(
            'min-h-[220px] px-3.5 py-3 text-sm leading-6 text-ink outline-none [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5',
            className,
          )}
          onInput={() => onChange(ref.current?.innerHTML ?? '')}
        />
      </div>
    </label>
  )
}
