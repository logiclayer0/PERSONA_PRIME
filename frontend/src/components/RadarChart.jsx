export default function RadarChart({ data, size = 240 }) {
  if (!data || data.length < 3) return null

  const center = size / 2
  const radius = size / 2 - 40
  const angleStep = (Math.PI * 2) / data.length

  const points = data.map((d, i) => {
    const angle = angleStep * i - Math.PI / 2
    const r = (d.value / 100) * radius
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
      labelX: center + Math.cos(angle) * (radius + 22),
      labelY: center + Math.sin(angle) * (radius + 22),
      label: d.label,
      value: d.value
    }
  })

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <div className="radar-chart" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {gridLevels.map((level, i) => {
          const gridPoints = data.map((_, idx) => {
            const angle = angleStep * idx - Math.PI / 2
            const r = level * radius
            return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`
          }).join(' ')
          return (
            <polygon
              key={i}
              points={gridPoints}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
              opacity="0.4"
            />
          )
        })}

        {data.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2
          const x = center + Math.cos(angle) * radius
          const y = center + Math.sin(angle) * radius
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth="1"
              opacity="0.3"
            />
          )
        })}

        <polygon
          points={polygonPoints}
          fill="var(--accent)"
          fillOpacity="0.25"
          stroke="var(--accent)"
          strokeWidth="2"
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--accent)" />
            <text
              x={p.labelX}
              y={p.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="radar-label"
            >
              {p.label}
            </text>
            <text
              x={p.labelX}
              y={p.labelY + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              className="radar-value"
            >
              {Math.round(p.value)}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}