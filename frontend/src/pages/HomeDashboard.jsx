import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import AppLayout from '../components/AppLayout'
import NotificationBar from '../components/NotificationBar'
import TutorModal from '../components/TutorModal'

export default function HomeDashboard() {
  const user = useAppStore((s) => s.user)
  const points = useAppStore((s) => s.points)
  const streak = useAppStore((s) => s.streak)
  const tutor = useAppStore((s) => s.tutor)
  const [showTutorModal, setShowTutorModal] = useState(false)

  useEffect(() => {
    const flag = localStorage.getItem('showTutorModal')
    if (flag === 'true' && !tutor) {
      setShowTutorModal(true)
    }
  }, [tutor])

  const handleCloseModal = () => {
    setShowTutorModal(false)
    localStorage.removeItem('showTutorModal')
  }

  return (
    <AppLayout>
      <NotificationBar />
      <div className="dashboard-container">
        <div className="dashboard-hero">
          <h1 className="dashboard-greeting">
            Welcome back, {user?.display_name || 'Speaker'}.
          </h1>
          <p className="dashboard-subtitle">
            Your training ground for powerful communication.
          </p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <p className="stat-label">Current Streak</p>
            <p className="stat-value">{streak} <span className="stat-unit">days</span></p>
            <p className="stat-hint">Practice daily to keep it alive</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Points</p>
            <p className="stat-value">{points} <span className="stat-unit">pts</span></p>
            <p className="stat-hint">Earn 50+ per session</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Sessions Completed</p>
            <p className="stat-value">{user?.total_sessions || 0}</p>
            <p className="stat-hint">Every rep counts</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Quick Start</h2>
          <div className="quick-actions">
            <Link to="/role" className="quick-action">
              <span className="quick-icon">🎯</span>
              <div>
                <p className="quick-title">Start New Practice</p>
                <p className="quick-desc">Interview, speech, debate, and more</p>
              </div>
            </Link>
            <Link to="/progress" className="quick-action">
              <span className="quick-icon">📈</span>
              <div>
                <p className="quick-title">View Progress</p>
                <p className="quick-desc">See your confidence trends</p>
              </div>
            </Link>
            <Link to="/report" className="quick-action">
              <span className="quick-icon">📊</span>
              <div>
                <p className="quick-title">Latest Report</p>
                <p className="quick-desc">Detailed session feedback</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <TutorModal
        open={showTutorModal}
        onClose={handleCloseModal}
        firstTime={true}
      />
    </AppLayout>
  )
}