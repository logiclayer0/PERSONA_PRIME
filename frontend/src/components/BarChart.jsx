export default function BarChart({ data, height = 200 }) {
  if (!data || data.length === 0) return null

  const maxVal = Math.max(...data.map((d) => d.value), 100)

  return (
    <div className="bar-chart" style={{ height }}>
      <div className="bar-chart-bars">
        {data.map((d, i) => {
          const pct = (d.value / maxVal) * 100
          return (
            <div key={i} className="bar-chart-col">
              <div className="bar-chart-value">{Math.round(d.value)}%</div>
              <div className="bar-chart-track">
                <div
                  className="bar-chart-fill"
                  style={{
                    height: `${pct}%`,
                    background: `linear-gradient(to top, ${d.color}, ${d.color}99)`
                  }}
                />
              </div>
              <div className="bar-chart-label">{d.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}