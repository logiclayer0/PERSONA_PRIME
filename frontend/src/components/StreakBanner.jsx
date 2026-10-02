import { useAppStore } from '../store/useAppStore'

export default function StreakBanner() {
  const user = useAppStore((s) => s.user)
  const points = useAppStore((s) => s.points)
  const streak = useAppStore((s) => s.streak)

  if (!user) return null

  return (
    <div className="streak-banner">
      <div className="streak-item">
        <span className="streak-icon">🔥</span>
        <div>
          <p className="streak-label">Streak</p>
          <p className="streak-value">{streak} {streak === 1 ? 'day' : 'days'}</p>
        </div>
      </div>
      <div className="streak-divider" />
      <div className="streak-item">
        <span className="streak-icon">⭐</span>
        <div>
          <p className="streak-label">Points</p>
          <p className="streak-value">{points}</p>
        </div>
      </div>
      <div className="streak-divider" />
      <div className="streak-item">
        <span className="streak-icon">🎯</span>
        <div>
          <p className="streak-label">Sessions</p>
          <p className="streak-value">{user.total_sessions || 0}</p>
        </div>
      </div>
    </div>
  )
}