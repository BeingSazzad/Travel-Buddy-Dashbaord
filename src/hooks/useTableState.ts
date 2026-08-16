import { PAGE_SIZE } from '@/lib/constants'
import { useMemo, useState } from 'react'

function compareValues(av: unknown, bv: unknown, dir: 'asc' | 'desc') {
  const mul = dir === 'asc' ? 1 : -1
  if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul
  return String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true, sensitivity: 'base' }) * mul
}

export function useTableState<T>(rows: T[], getSearch: (row: T) => string, initialSort = '', initialDir: 'asc' | 'desc' = 'asc') {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState(initialSort)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(initialDir)

  function onSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q ? rows.filter((r) => getSearch(r).toLowerCase().includes(q)) : [...rows]
    if (!sortKey) return list
    list.sort((a, b) => {
      const recA = a as Record<string, unknown>
      const recB = b as Record<string, unknown>
      return compareValues(recA[sortKey], recB[sortKey], sortDir)
    })
    return list
  }, [rows, search, getSearch, sortKey, sortDir])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return {
    search,
    setSearch: (v: string) => {
      setSearch(v)
      setPage(1)
    },
    page: safePage,
    setPage,
    pages,
    total: filtered.length,
    paged,
    sortKey,
    sortDir,
    onSort,
  }
}
