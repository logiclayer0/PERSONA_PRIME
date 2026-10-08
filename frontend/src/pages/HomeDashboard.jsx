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
        <section className="home-hero home-hero-v2">
          <div className="home-hero-v2-grid">
            <div className="home-hero-v2-copy">
              <div className="home-v2-eyebrow"><span className="home-v2-pulse"></span> PERSONA PRIME</div>
              <h1>Don't just choose<br/><span>your future.</span><br/>Understand it.</h1>
              <p>Discover who you are. Build a direction that fits you. Then turn that direction into skills you can actually practice.</p>
              <div className="home-v2-actions">
                <Link to={hasDiscovery ? '/blueprint' : '/discover'} className="home-v2-primary">{hasDiscovery ? 'Continue to Blueprint' : 'Start Your Discovery'} <span>↗</span></Link>
                <Link to="/role" className="home-v2-secondary">Explore Practice</Link>
              </div>
            </div>
            <div className="home-v2-visual">
              <div className="home-v2-ring ring-1"></div><div className="home-v2-ring ring-2"></div><div className="home-v2-ring ring-3"></div>
              <div className="home-v2-core"><strong>YOU</strong><span>SELF → SKILLS<br/>→ DIRECTION</span></div>
              <div className="home-v2-node node-self"><b>01</b><small>SELF</small></div>
              <div className="home-v2-node node-skill"><b>02</b><small>SKILLS</small></div>
              <div className="home-v2-node node-direction"><b>03</b><small>DIRECTION</small></div>
            </div>
          </div>
          <div className="home-v2-footer"><span>PERSONALIZED</span><i></i><span>ADAPTIVE</span><i></i><span>MEASURABLE</span><i></i><span>BUILT AROUND YOU</span></div>
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