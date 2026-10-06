import AppLayout from '../components/AppLayout'
import { useAppStore } from '../store/useAppStore'

export default function Progress() {
  const user = useAppStore((s) => s.user)
  const points = useAppStore((s) => s.points)
  const streak = useAppStore((s) => s.streak)
  const sessions = user?.total_sessions || 0
  const level = Math.floor(points / 100) + 1
  const nextLevel = level * 100
  const progressToNext = Math.min(100, Math.round((points % 100)))
  const milestones = [
    { label: 'First practice session', detail: 'Complete your first coached session', done: sessions >= 1 },
    { label: '3-day consistency', detail: 'Practice for three consecutive days', done: streak >= 3 },
    { label: '7-day consistency', detail: 'Build a one-week practice habit', done: streak >= 7 },
    { label: '100 practice points', detail: 'Reach your first performance milestone', done: points >= 100 },
    { label: '10 sessions', detail: 'Complete ten communication sessions', done: sessions >= 10 },
    { label: '500 practice points', detail: 'Reach an advanced practice milestone', done: points >= 500 }
  ]

  return (
    <AppLayout>
      <div className="dashboard-container">
        <div className="dashboard-hero">
          <p className="dashboard-eyebrow">PERFORMANCE OVERVIEW</p>
          <h1 className="dashboard-greeting">Progress</h1>
          <p className="dashboard-subtitle">A clear view of your consistency and practice history.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card"><p className="stat-label">Current streak</p><p className="stat-value">{streak}<span className="stat-unit"> days</span></p><p className="stat-hint">Consecutive practice days</p></div>
          <div className="stat-card"><p className="stat-label">Sessions completed</p><p className="stat-value">{sessions}</p><p className="stat-hint">Coached communication sessions</p></div>
          <div className="stat-card"><p className="stat-label">Practice points</p><p className="stat-value">{points}</p><p className="stat-hint">Level {level} · {nextLevel - points} points to next level</p></div>
        </div>

        <section className="dashboard-section">
          <div className="section-heading-row"><div><h2 className="section-title">Current level</h2><p className="section-description">Keep practicing to build measurable momentum.</p></div><span className="discover-step-label">{progressToNext}% complete</span></div>
          <div className="discover-progress-bar"><div className="discover-progress-fill" style={{width: progressToNext + '%'}} /></div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading-row"><div><h2 className="section-title">Milestones</h2><p className="section-description">Long-term progress is built through repeatable practice.</p></div></div>
          <div className="milestone-list">
            {milestones.map((m) => <div key={m.label} className={'milestone ' + (m.done ? 'milestone-done' : '')}><span className="milestone-check">{m.done ? '✓' : '—'}</span><div><strong>{m.label}</strong><p className="stat-hint">{m.detail}</p></div></div>)}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}