import AppLayout from '../components/AppLayout'
import { useAppStore } from '../store/useAppStore'

export default function Progress() {
  const user = useAppStore((s) => s.user)
  const points = useAppStore((s) => s.points)
  const streak = useAppStore((s) => s.streak)

  return (
    <AppLayout>
      <div className="dashboard-container">
        <h1 className="dashboard-greeting">Your Progress</h1>
        <p className="dashboard-subtitle">Track how far you've come.</p>

        <div className="dashboard-stats">
          <div className="stat-card">
            <p className="stat-label">Streak</p>
            <p className="stat-value">{streak}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Points</p>
            <p className="stat-value">{points}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Level</p>
            <p className="stat-value">{Math.floor(points / 100) + 1}</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Milestones</h2>
          <div className="milestone-list">
            {[
              { label: 'First Session', done: (user?.total_sessions || 0) >= 1 },
              { label: '3 Day Streak', done: streak >= 3 },
              { label: '7 Day Streak', done: streak >= 7 },
              { label: '100 Points', done: points >= 100 },
              { label: '500 Points', done: points >= 500 },
              { label: '10 Sessions', done: (user?.total_sessions || 0) >= 10 }
            ].map((m) => (
              <div key={m.label} className={`milestone ${m.done ? 'milestone-done' : ''}`}>
                <span className="milestone-check">{m.done ? '✓' : '○'}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}