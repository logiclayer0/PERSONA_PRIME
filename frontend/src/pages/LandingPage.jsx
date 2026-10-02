import { Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import QuoteBanner from '../components/QuoteBanner'
import LanguageSelector from '../components/LanguageSelector'
import SettingsModal from '../components/SettingsModal'
import Model3DAvatar from '../components/Model3DAvatar'
import { TUTORS } from '../data/tutors'

export default function LandingPage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [previewTutor, setPreviewTutor] = useState(TUTORS[2])

  return (
    <div className="page-root">
      <Navbar />

      <div className="top-bar">
        <LanguageSelector />
        <button onClick={() => setSettingsOpen(true)} className="btn-ghost-small">
          ⚙ Settings
        </button>
      </div>

      <QuoteBanner />

      <main className="landing-main landing-main-split">
        <div className="landing-left">
          <h1 className="landing-title">PERSONA_PRIME</h1>
          <p className="landing-tagline">UPGRADE YOUR VOICE. OWN THE ROOM.</p>
          <p className="landing-desc">
            AI-powered public speaking coach that watches, listens, and trains you like a real mentor.
          </p>

          <div className="landing-tutor-chips">
            {TUTORS.map((t) => (
              <button
                key={t.id}
                className={`landing-chip ${previewTutor.id === t.id ? 'landing-chip-active' : ''}`}
                onMouseEnter={() => setPreviewTutor(t)}
                onClick={() => setPreviewTutor(t)}
                style={{
                  borderColor: previewTutor.id === t.id ? t.color : undefined,
                  color: previewTutor.id === t.id ? t.color : undefined
                }}
              >
                {t.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <Link to="/auth?mode=register" className="btn-cta">
            LET'S UPGRADE YOURSELF →
          </Link>
        </div>

        <div className="landing-right">
          <div className="landing-avatar-large" key={previewTutor.id}>
            <Model3DAvatar tutorId={previewTutor.id} isSpeaking={false} size="large" />
          </div>
          <div className="landing-avatar-quote" key={previewTutor.id + '-quote'}>
            <p>"{previewTutor.tagline}"</p>
            <span style={{ color: previewTutor.color }}>— {previewTutor.name.toUpperCase()}</span>
          </div>
        </div>
      </main>

      <div className="feature-grid-wrap">
        <div className="feature-grid">
          <div className="feature-card">
            <h3 className="feature-title">REAL-TIME VISION</h3>
            <p className="feature-desc">Posture, eye contact, gestures analyzed live.</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">SPEECH INTELLIGENCE</h3>
            <p className="feature-desc">Fillers, pace, grammar, and clarity scored.</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">PERSONAL AI TUTOR</h3>
            <p className="feature-desc">Pick your mentor personality and train.</p>
          </div>
        </div>
      </div>

      <Footer />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}