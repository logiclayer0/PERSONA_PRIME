import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Model3DAvatar from './Model3DAvatar'
import { TUTORS } from '../data/tutors'
import { useAppStore } from '../store/useAppStore'

export default function TutorModal({ open, onClose, firstTime = false }) {
  const [selected, setSelected] = useState(null)
  const [previewSpeaking, setPreviewSpeaking] = useState(null)
  const currentTutor = useAppStore((s) => s.tutor)
  const setTutor = useAppStore((s) => s.setTutor)
  const user = useAppStore((s) => s.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setSelected(currentTutor || null)
    }
  }, [open, currentTutor])

  useEffect(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices()
  }, [])

  if (!open) return null

  const preview = (tutor) => {
    setPreviewSpeaking(tutor.id)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(tutor.welcomeText)
      u.pitch = tutor.voicePitch
      u.rate = tutor.voiceRate
      u.onend = () => setPreviewSpeaking(null)
      u.onerror = () => setPreviewSpeaking(null)
      window.speechSynthesis.speak(u)
    }
  }

  const handleSelect = (tutor) => {
    setSelected(tutor)
    preview(tutor)
  }

  const handleConfirm = () => {
    if (!selected) return
    setTutor(selected)
    onClose()
    if (firstTime) {
      navigate('/role')
    }
  }

  return (
    <div className="tutor-modal-overlay">
      <div className="tutor-modal-big">
        <div className="tutor-modal-top">
          <div>
            <h2 className="tutor-modal-heading">
              {firstTime
                ? `Welcome${user?.display_name ? ', ' + user.display_name : ''}.`
                : 'Change Your Tutor'}
            </h2>
            <p className="tutor-modal-subheading">
              {firstTime
                ? 'Choose your AI Tutor to begin your journey'
                : 'Pick a different personality for your training'}
            </p>
          </div>
          {!firstTime && (
            <button className="tutor-modal-close" onClick={onClose}>✕</button>
          )}
        </div>

        <div className="tutor-modal-cards">
          {TUTORS.map((t) => (
            <div
              key={t.id}
              className={`tutor-modal-big-card ${selected?.id === t.id ? 'tutor-modal-big-card-active' : ''}`}
              onClick={() => handleSelect(t)}
              style={{
                borderColor: selected?.id === t.id ? t.color : undefined,
                boxShadow: selected?.id === t.id ? `0 0 32px ${t.bgGlow}` : undefined
              }}
            >
              <div className="tutor-modal-big-model">
                <Model3DAvatar tutorId={t.id} isSpeaking={previewSpeaking === t.id} size="medium" />
              </div>
              <h3 className="tutor-modal-big-name">{t.name}</h3>
              <p className="tutor-modal-big-role" style={{ color: t.color }}>{t.role}</p>
              <p className="tutor-modal-big-desc">{t.desc}</p>
              <p className="tutor-modal-big-tagline" style={{ color: t.color }}>"{t.tagline}"</p>
              <button
                className={`tutor-modal-big-btn ${selected?.id === t.id ? 'tutor-modal-big-btn-active' : ''}`}
                style={selected?.id === t.id ? { background: t.color, borderColor: t.color } : {}}
              >
                {selected?.id === t.id ? '✓ SELECTED' : 'SELECT TUTOR'}
              </button>
            </div>
          ))}
        </div>

        <div className="tutor-modal-actions">
          <button
            disabled={!selected}
            onClick={handleConfirm}
            className="btn-primary tutor-modal-confirm"
          >
            {firstTime ? 'CONTINUE →' : 'CONFIRM CHANGE'}
          </button>
        </div>
      </div>
    </div>
  )
}