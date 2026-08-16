import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

type Column<T> = {
  key: string
  header: string
  sortable?: boolean
  render: (row: T) => ReactNode
}

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  empty?: string
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string) => void
  dense?: boolean
  onRowClick?: (row: T) => void
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty = 'Nothing to show.',
  sortKey,
  sortDir,
  onSort,
  dense,
  onRowClick,
}: Props<T>) {
  const colSpan = columns.length
  const cell = dense ? 'px-4 py-2.5' : 'px-6 py-4'
  const head = dense ? 'px-4 py-2.5' : 'px-6 py-3.5'

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-[#f7f8fb] text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            {columns.map((col) => (
              <th key={col.key} className={`${head} font-semibold ${col.key === 'actions' ? 'w-[120px] text-right' : 'text-left'}`}>
                {col.sortable && onSort ? (
                  <button type="button" className="inline-flex items-center gap-1" onClick={() => onSort(col.key)}>
                    {col.header}
                    <Icon
                      name={sortKey === col.key ? (sortDir === 'asc' ? 'sortAsc' : 'sortDesc') : 'sort'}
                      className="h-3 w-3 text-muted"
                    />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className={`${cell} py-12 text-center text-muted`} colSpan={colSpan}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const id = rowKey(row)
              return (
                <tr
                  key={id}
                  className={`border-b border-line/80 last:border-0 transition-colors hover:bg-[#f7f9fc] ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`${cell} text-ink ${col.key === 'actions' ? 'text-right' : ''}`}
                      onClick={col.key === 'actions' ? (e) => e.stopPropagation() : undefined}
                    >
                      <div className={col.key === 'actions' ? 'flex justify-end' : undefined}>{col.render(row)}</div>
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
