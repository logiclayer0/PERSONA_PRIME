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
  const sessions = user?.total_sessions || 0
  const hasDiscovery = Boolean(user?.discovery_completed || user?.roadmap_generated)

  useEffect(() => {
    if (localStorage.getItem('showTutorModal') === 'true' && !tutor) setShowTutorModal(true)
  }, [tutor])

  const handleCloseModal = () => { setShowTutorModal(false); localStorage.removeItem('showTutorModal') }

  return (
    <AppLayout>
      <div className="dashboard-container">
        <section className="home-hero">
          <div className="home-hero-top"><span className="home-status"><i></i> PERSONAL DEVELOPMENT SYSTEM</span><span className="home-index">01 — 04</span></div>
          <div className="home-command">
          <div className="home-command-copy">
            <p className="dashboard-eyebrow">PERSONA PRIME / PERSONAL DEVELOPMENT</p>
            <h1 className="dashboard-greeting">Build a clearer version of yourself.</h1>
            <p className="dashboard-subtitle">Discover your strengths, turn them into direction, and practice the skills that move you forward.</p>
            <div className="home-command-actions">
              <Link to={hasDiscovery ? '/blueprint' : '/discover'} className="btn-primary">{hasDiscovery ? 'Open My Blueprint' : 'Begin Discovery'}</Link>
              <Link to="/role" className="btn-ghost">Practice a Skill</Link>
            </div>
          </div>
          <div className="home-command-visual">
            <div className="home-orbit orbit-a"></div><div className="home-orbit orbit-b"></div>
            <div className="home-orbit-core"><span>PP</span><small>PERSONA<br/>PRIME</small></div>
            <div className="home-orbit-label label-top">SELF</div><div className="home-orbit-label label-right">SKILLS</div><div className="home-orbit-label label-bottom">DIRECTION</div>
          </div>
          </div>
          <div className="home-hero-bottom"><span>SELF-DISCOVERY</span><span className="home-hero-line"></span><span>CAREER DIRECTION</span><span className="home-hero-line"></span><span>REAL-WORLD PRACTICE</span></div>
        </section>

        <section className="home-metrics">
          <div className="home-metric"><span>01</span><div><p>Practice streak</p><strong>{streak}<em> days</em></strong></div></div>
          <div className="home-metric"><span>02</span><div><p>Sessions completed</p><strong>{sessions}</strong></div></div>
          <div className="home-metric"><span>03</span><div><p>Practice points</p><strong>{points}</strong></div></div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading-row"><div><p className="section-kicker">THE PERSONA PRIME METHOD</p><h2 className="section-title">From self-awareness to action.</h2><p className="section-description">One connected workflow instead of disconnected self-help tools.</p></div></div>
          <div className="home-method-grid">
            <Link to="/discover" className="home-method-card"><span className="home-method-index">01</span><div><h3>Discover</h3><p>Map personality, interests, strengths and aspirations.</p></div><span className="home-method-arrow">↗</span></Link>
            <Link to="/blueprint" className="home-method-card"><span className="home-method-index">02</span><div><h3>Define</h3><p>Translate your profile into career direction and a five-year roadmap.</p></div><span className="home-method-arrow">↗</span></Link>
            <Link to="/role" className="home-method-card"><span className="home-method-index">03</span><div><h3>Practice</h3><p>Work with your AI coach and strengthen real communication skills.</p></div><span className="home-method-arrow">↗</span></Link>
            <Link to="/progress" className="home-method-card"><span className="home-method-index">04</span><div><h3>Measure</h3><p>Track sessions, consistency and performance over time.</p></div><span className="home-method-arrow">↗</span></Link>
          </div>
        </section>

        <section className="home-focus-card">
          <div><p className="section-kicker">NEXT BEST ACTION</p><h2>{sessions ? 'Your next improvement is one session away.' : 'Start with one honest assessment.'}</h2><p>{sessions ? 'Use your latest performance report to choose the skill you want to improve next.' : 'Persona Prime will use your answers to build a profile and personalize your development path.'}</p></div>
          <Link to={sessions ? '/report' : '/discover'} className="home-focus-link">{sessions ? 'Review latest report →' : 'Start assessment →'}</Link>
        </section>
      </div>
      <TutorModal open={showTutorModal} onClose={handleCloseModal} firstTime={true} />
    </AppLayout>
  )
}