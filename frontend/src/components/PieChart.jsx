export default function PieChart({ data, size = 180 }) {
  const activeData = data.filter((d) => d.value > 0)

  if (activeData.length === 0) {
    return (
      <div className="pie-empty" style={{ width: size, height: size }}>
        <span>No data</span>
      </div>
    )
  }

  const total = activeData.reduce((sum, d) => sum + d.value, 0)

  const radius = size / 2
  const strokeWidth = 24
  const center = radius
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2)

  let offset = 0

  return (
    <div className="pie-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {activeData.map((d, i) => {
          const pct = d.value / total
          const dash = pct * circumference
          const gap = circumference - dash
          const el = (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius - strokeWidth / 2}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${center} ${center})`}
              strokeLinecap="butt"
            />
          )
          offset += dash
          return el
        })}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          className="pie-center-num"
        >
          {Math.round(total / activeData.length)}%
        </text>
        <text
          x={center}
          y={center + 16}
          textAnchor="middle"
          className="pie-center-label"
        >
          Average
        </text>
      </svg>
    </div>
  )
}