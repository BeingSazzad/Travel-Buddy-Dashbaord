type Series = { label: string; left: number; right: number }

function roundTopBar(x: number, y: number, w: number, h: number, r: number) {
  if (h <= 0 || w <= 0) return ''
  const radius = Math.min(r, w / 2, h)
  return [
    `M ${x} ${y + h}`,
    `L ${x} ${y + radius}`,
    `Q ${x} ${y} ${x + radius} ${y}`,
    `L ${x + w - radius} ${y}`,
    `Q ${x + w} ${y} ${x + w} ${y + radius}`,
    `L ${x + w} ${y + h}`,
    'Z',
  ].join(' ')
}

export function SplitBarChart({
  series,
  leftColor = '#9D8058',
  rightColor = '#1A1410',
  ariaLabel = 'Grouped bars',
}: {
  series: Series[]
  leftColor?: string
  rightColor?: string
  ariaLabel?: string
}) {
  const w = 640
  const h = 220
  const pad = { l: 44, r: 12, t: 12, b: 28 }
  const rows = series.length ? series : [{ label: '—', left: 0, right: 0 }]
  const max = Math.max(...rows.flatMap((s) => [s.left, s.right]), 1)
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b
  const group = innerW / rows.length
  const gap = Math.min(8, group * 0.1)
  const pair = Math.min(group * 0.58, 64)
  const bw = Math.max(7, (pair - gap) / 2)

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-[220px] w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={ariaLabel}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const y = pad.t + (innerH / 4) * i
        const val = Math.round(max - (max / 4) * i)
        return (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#E6EAF2" />
            <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#8A93A6">
              {val}
            </text>
          </g>
        )
      })}
      {rows.map((s, i) => {
        const mid = pad.l + group * i + group / 2
        const xLeft = mid - gap / 2 - bw
        const xRight = mid + gap / 2
        const lh = s.left > 0 ? Math.max(4, (s.left / max) * innerH) : 0
        const rh = s.right > 0 ? Math.max(4, (s.right / max) * innerH) : 0
        const radius = Math.min(10, bw / 2)
        return (
          <g key={`${s.label}-${i}`}>
            <path d={roundTopBar(xLeft, pad.t + innerH - lh, bw, lh, radius)} fill={leftColor} />
            <path d={roundTopBar(xRight, pad.t + innerH - rh, bw, rh, radius)} fill={rightColor} />
            <text x={mid} y={h - 8} textAnchor="middle" fontSize="10" fill="#8A93A6">
              {s.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
