export function createStore<T extends { id: string }>(key: string, seed: T[]) {
  const read = (): T[] => {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed))
      return seed.map((row) => ({ ...row }))
    }
    try {
      return JSON.parse(raw) as T[]
    } catch {
      return seed.map((row) => ({ ...row }))
    }
  }

  const write = (rows: T[]) => {
    localStorage.setItem(key, JSON.stringify(rows))
  }

  return {
    list: read,
    get(id: string) {
      return read().find((row) => row.id === id) ?? null
    },
    upsert(row: T) {
      const rows = read()
      const index = rows.findIndex((item) => item.id === row.id)
      if (index >= 0) rows[index] = row
      else rows.unshift(row)
      write(rows)
      return row
    },
    patch(id: string, partial: Partial<T>) {
      const rows = read()
      const index = rows.findIndex((item) => item.id === id)
      if (index < 0) return null
      rows[index] = { ...rows[index], ...partial }
      write(rows)
      return rows[index]
    },
    remove(id: string) {
      write(read().filter((row) => row.id !== id))
    },
  }
}
