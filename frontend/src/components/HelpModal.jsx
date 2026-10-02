export default function HelpModal({ open, onClose }) {
  if (!open) return null

  const sections = [
    { icon: '🎯', title: 'Choose Your Practice', desc: 'Select interview, speech, debate, or any public speaking category.' },
    { icon: '🤖', title: 'Pick Your Tutor', desc: 'Three AI tutors with different personalities — empathetic, strict, or expressive.' },
    { icon: '🎤', title: 'Record Your Session', desc: 'Camera and mic analyze your posture, eye contact, speech pace, and confidence.' },
    { icon: '📊', title: 'Get Detailed Reports', desc: 'See confidence scores, pie charts, timeline events, and personalized AI feedback.' },
    { icon: '🔥', title: 'Build Streaks', desc: 'Practice daily to grow your streak, earn points, and unlock milestones.' }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2 className="help-title">How Persona Prime Works</h2>
          <button className="help-close" onClick={onClose}>✕</button>
        </div>
        <div className="help-body">
          {sections.map((s, i) => (
            <div key={i} className="help-item">
              <span className="help-icon">{s.icon}</span>
              <div>
                <p className="help-item-title">{s.title}</p>
                <p className="help-item-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="help-footer">
          <p>Need more help? Check the docs or contact support.</p>
        </div>
      </div>
    </div>
  )
}