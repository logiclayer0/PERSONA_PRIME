import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import AppLayout from '../components/AppLayout'
import TutorModal from '../components/TutorModal'

export default function HomeDashboard() {
  const user = useAppStore((s) => s.user)
  const points = useAppStore((s) => s.points)
  const streak = useAppStore((s) => s.streak)
  const tutor = useAppStore((s) => s.tutor)
  const [showTutorModal, setShowTutorModal] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('showTutorModal') === 'true' && !tutor) setShowTutorModal(true)
  }, [tutor])

  const handleCloseModal = () => { setShowTutorModal(false); localStorage.removeItem('showTutorModal') }
  const hasSessions = (user?.total_sessions || 0) > 0

  return (
    <AppLayout>
      <div className="dashboard-container">
        <div className="dashboard-hero">
          <p className="dashboard-eyebrow">PERSONAL DEVELOPMENT SYSTEM</p>
          <h1 className="dashboard-greeting">Welcome back, {user?.display_name || 'there'}.</h1>
          <p className="dashboard-subtitle">Understand yourself. Build your direction. Practice what matters.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card"><p className="stat-label">Practice Streak</p><p className="stat-value">{streak} <span className="stat-unit">days</span></p><p className="stat-hint">Consistency over intensity</p></div>
          <div className="stat-card"><p className="stat-label">Sessions</p><p className="stat-value">{user?.total_sessions || 0}</p><p className="stat-hint">Communication sessions completed</p></div>
          <div className="stat-card"><p className="stat-label">Points</p><p className="stat-value">{points}</p><p className="stat-hint">Earned through practice</p></div>
        </div>

        <section className="dashboard-section">
          <div className="section-heading-row"><div><h2 className="section-title">Your development path</h2><p className="section-description">Persona Prime connects self-discovery with deliberate practice.</p></div></div>
          <div className="development-path">
            <Link to="/discover" className="development-step"><span className="development-number">01</span><div><p className="quick-title">Discover Yourself</p><p className="quick-desc">Build your personal profile from your answers, interests and aspirations.</p></div></Link>
            <Link to="/blueprint" className="development-step"><span className="development-number">02</span><div><p className="quick-title">Your Blueprint</p><p className="quick-desc">Turn your profile into a structured five-year direction and action plan.</p></div></Link>
            <Link to="/role" className="development-step"><span className="development-number">03</span><div><p className="quick-title">Practice & Improve</p><p className="quick-desc">Train with your AI coach and measure communication performance.</p></div></Link>
          </div>
        </section>

        <section className="dashboard-section dashboard-next-step">
          <div><p className="section-kicker">RECOMMENDED NEXT STEP</p><h2>{hasSessions ? 'Review your progress and practice again.' : 'Start your first communication practice.'}</h2><p>{hasSessions ? 'Use your latest report to choose the next skill you want to strengthen.' : 'Record a session and get feedback across posture, eye contact, gestures, speech and grammar.'}</p></div>
          <Link to={hasSessions ? '/progress' : '/role'} className="btn-primary">{hasSessions ? 'View Progress' : 'Start Practice'}</Link>
        </section>
      </div>
      <TutorModal open={showTutorModal} onClose={handleCloseModal} firstTime={true} />
    </AppLayout>
  )
}
