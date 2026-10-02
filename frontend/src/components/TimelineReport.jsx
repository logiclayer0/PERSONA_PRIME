export default function TimelineReport({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="timeline-empty">
        <p>No timeline events recorded yet.</p>
      </div>
    )
  }

  const severityClass = {
    info: 'timeline-info',
    warning: 'timeline-warning',
    error: 'timeline-error'
  }

  return (
    <div className="timeline-wrap">
      {events.map((e, i) => (
        <div key={i} className="timeline-item">
          <span className="timeline-time">{e.formatted || `00:${i}`}</span>
          <span className={`timeline-dot ${severityClass[e.severity] || 'timeline-info'}`} />
          <div className="timeline-content">
            <p className="timeline-type">{e.type}</p>
            <p className="timeline-msg">{e.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}