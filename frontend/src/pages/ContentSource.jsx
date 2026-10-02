import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAppStore } from '../store/useAppStore'

export default function ContentSource() {
  const navigate = useNavigate()
  const setContentMode = useAppStore((s) => s.setContentMode)

  const pick = (mode) => {
    setContentMode(mode)
    if (mode === 'ai') navigate('/script')
    else navigate('/studio')
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="flow-container">
          <h1 className="flow-title">Content Source</h1>
          <p className="flow-subtitle">What will you speak?</p>
          <div className="source-grid">
            <button onClick={() => pick('own')} className="source-card">
              <span className="source-icon">✍️</span>
              <h3 className="source-title">Own Content</h3>
              <p className="source-desc">Bring your own script or speak off the cuff.</p>
            </button>
            <button onClick={() => pick('ai')} className="source-card">
              <span className="source-icon">🤖</span>
              <h3 className="source-title">AI Generated</h3>
              <p className="source-desc">Let Persona Prime write a custom script for you.</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}