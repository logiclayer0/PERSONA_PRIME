import { Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LanguageSelector from '../components/LanguageSelector'
import SettingsModal from '../components/SettingsModal'
import Model3DAvatar from '../components/Model3DAvatar'
import { TUTORS } from '../data/tutors'

export default function LandingPage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [previewTutor, setPreviewTutor] = useState(TUTORS[2])

  return (
    <div className="page-root pp-landing">
      <Navbar />
      <div className="pp-landing-tools">
        <LanguageSelector />
        <button onClick={() => setSettingsOpen(true)} className="btn-ghost-small">Settings</button>
      </div>

      <main className="pp-landing-hero">
        <div className="pp-landing-copy">
          <div className="pp-landing-status"><span></span> PERSONAL DEVELOPMENT / AI COACHING</div>
          <h1>Understand yourself.<br/><em>Build what comes next.</em></h1>
          <p className="pp-landing-lead">Persona Prime connects self-discovery, career direction and real-world communication practice into one personal growth system.</p>
          <div className="pp-landing-actions">
            <Link to="/auth?mode=register" className="pp-landing-primary">Begin your profile <span>↗</span></Link>
            <Link to="/auth?mode=login" className="pp-landing-secondary">Sign in</Link>
          </div>
          <div className="pp-landing-proof">
            <div><strong>01</strong><span>Discover</span></div><i></i>
            <div><strong>02</strong><span>Build a Blueprint</span></div><i></i>
            <div><strong>03</strong><span>Practice</span></div><i></i>
            <div><strong>04</strong><span>Measure</span></div>
          </div>
        </div>

        <div className="pp-landing-stage">
          <div className="pp-stage-orbit stage-o1"></div><div className="pp-stage-orbit stage-o2"></div>
          <div className="pp-stage-grid"></div>
          <div className="pp-stage-label stage-label-a">PERSONALIZED</div>
          <div className="pp-stage-label stage-label-b">ADAPTIVE</div>
          <div className="pp-stage-avatar"><Model3DAvatar tutorId={previewTutor.id} isSpeaking={false} size="large" /></div>
          <div className="pp-stage-card">
            <div><span>YOUR AI COACH</span><strong>{previewTutor.name}</strong></div>
            <p>{previewTutor.tagline}</p>
          </div>
          <div className="pp-tutor-switcher">
            {TUTORS.map((t) => <button key={t.id} onMouseEnter={() => setPreviewTutor(t)} onClick={() => setPreviewTutor(t)} className={previewTutor.id === t.id ? 'active' : ''}>{t.name.split(' ')[0]}</button>)}
          </div>
        </div>
      </main>

      <section className="pp-landing-capabilities">
        <div className="pp-capability-intro"><span>THE SYSTEM</span><h2>From knowing yourself<br/>to proving your growth.</h2></div>
        <div className="pp-capability-grid">
          <article><span>01 / DISCOVERY</span><h3>Build your profile</h3><p>Adaptive questions map personality, interests, strengths and aspirations.</p></article>
          <article><span>02 / BLUEPRINT</span><h3>Find your direction</h3><p>Turn your profile into career matches, a roadmap and practical next steps.</p></article>
          <article><span>03 / PRACTICE</span><h3>Train in real situations</h3><p>Practice communication while AI observes speech, presence and delivery.</p></article>
          <article><span>04 / PROGRESS</span><h3>See the difference</h3><p>Track consistency and performance so improvement becomes visible over time.</p></article>
        </div>
      </section>

      <Footer />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}