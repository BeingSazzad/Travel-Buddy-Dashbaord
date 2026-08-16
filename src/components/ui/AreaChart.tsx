type Props = {
  values: number[]
  labels?: string[]
  ariaLabel?: string
  fillId?: string
  stroke?: string
  fill?: string
  formatY?: (value: number) => string
}

export function AreaChart({
  values,
  labels,
  ariaLabel = 'Trend',
  fillId = 'areaFill',
  stroke = '#6B5539',
  fill = '#9D8058',
  formatY,
}: Props) {
  const w = 640
  const h = 220
  const pad = { l: 48, r: 12, t: 12, b: 28 }
  const series = values.length ? values : [0]
  const max = Math.max(...series, 1)
  const min = 0
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b
  const span = Math.max(series.length - 1, 1)
  const pts = series.map((v, i) => {
    const x = pad.l + (i / span) * innerW
    const y = pad.t + innerH - ((v - min) / (max - min || 1)) * innerH
    return { x, y }
  })
  const line = pts.map((p) => `${p.x},${p.y}`).join(' ')
  const area = `${pad.l},${pad.t + innerH} ${line} ${pad.l + innerW},${pad.t + innerH}`
  const ticks = 4
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => Math.round(max - (max / ticks) * i))
  const xLabels = (labels ?? series.map((_, i) => `W${i + 1}`)).slice(0, pts.length)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[220px] w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={ariaLabel}>
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.28" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((t, i) => {
        const y = pad.t + (innerH / ticks) * i
        return (
          <g key={`${t}-${i}`}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#E6EAF2" />
            <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#8A93A6">
              {formatY ? formatY(t) : t}
            </text>
          </g>
        )
      })}
      <polygon fill={`url(#${fillId})`} points={area} />
      <polyline fill="none" stroke={stroke} strokeWidth="2.2" points={line} />
      {pts.length <= 14
        ? pts.map((p) => (
            <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="3.2" fill="#fff" stroke={fill} strokeWidth="2" />
          ))
        : null}
      {xLabels.map((label, i) => {
        const p = pts[i]
        if (!p || !label) return null
        return (
          <text key={`${label}-${i}`} x={p.x} y={h - 8} textAnchor="middle" fontSize="10" fill="#8A93A6">
            {label}
          </text>
        )
      })}
    </svg>
  )
}
