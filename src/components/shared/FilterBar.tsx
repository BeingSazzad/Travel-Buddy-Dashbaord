import type { ReactNode } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

type Filter = {
  key: string
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}

export function FilterBar({
  search,
  onSearch,
  placeholder = 'Search…',
  filters = [],
  extra,
}: {
  search: string
  onSearch: (v: string) => void
  placeholder?: string
  filters?: Filter[]
  extra?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-line px-6 py-4">
      <div className="min-w-[200px] flex-1">
        <Input icon="search" placeholder={placeholder} value={search} onChange={(e) => onSearch(e.target.value)} />
      </div>
      {filters.map((f) => (
        <div key={f.key} className="w-[168px]">
          <Select label={f.label} value={f.value} onChange={(e) => f.onChange(e.target.value)} options={f.options} />
        </div>
      ))}
      {extra ? <div className="flex h-11 items-center">{extra}</div> : null}
    </div>
  )
}
