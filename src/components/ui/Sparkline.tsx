type Props = {
  values: number[]
  className?: string
  color?: string
}

export function Sparkline({ values, className, color = '#9D8058' }: Props) {
  const series = values.length ? values : [0]
  const max = Math.max(...series, 1)
  const min = Math.min(...series, 0)
  const h = 40
  const w = 120
  const span = Math.max(series.length - 1, 1)
  const pts = series.map((v, i) => {
    const x = (i / span) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2
    return `${x},${y}`
  })
  const line = pts.join(' ')
  const area = `0,${h} ${line} ${w},${h}`
  const id = `spark-${series.length}-${series[0]}-${series[series.length - 1]}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label="Trend">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#${id})`} points={area} />
      <polyline fill="none" stroke={color} strokeWidth="1.8" points={line} />
    </svg>
  )
}
