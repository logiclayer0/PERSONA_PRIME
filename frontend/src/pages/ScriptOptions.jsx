import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Teleprompter from '../components/Teleprompter'
import { useAppStore } from '../store/useAppStore'
import { generateScript } from '../services/apiService'

const DURATIONS = [1, 2, 3, 4, 5, 10]

export default function ScriptOptions() {
  const navigate = useNavigate()
  const category = useAppStore((s) => s.category)
  const role = useAppStore((s) => s.role)
  const setDurationStore = useAppStore((s) => s.setDuration)
  const setScriptText = useAppStore((s) => s.setScriptText)

  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState(2)
  const [mode, setMode] = useState('teleprompter')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState('')

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    try {
      const res = await generateScript({
        category: category || 'speech',
        topic,
        duration_minutes: duration,
        language: 'English',
        role: role || 'student'
      })
      setScript(res.script)
      setScriptText(res.script)
      setDurationStore(duration)
    } catch (e) {
      alert('Failed to generate script')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    setDurationStore(duration)
    navigate('/studio')
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="flow-container">
          <h1 className="flow-title">Script Generator</h1>
          <p className="flow-subtitle">Custom script for your session</p>

          <div className="surface-card flow-panel">
            <div className="form-group">
              <label className="settings-label">Topic</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. AI in Education, My First Job..."
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="settings-label">Duration</label>
              <div className="duration-row">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`duration-pill ${duration === d ? 'duration-pill-active' : ''}`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="settings-label">Reading Mode</label>
              <div className="mode-row">
                <button
                  onClick={() => setMode('teleprompter')}
                  className={`mode-btn ${mode === 'teleprompter' ? 'mode-btn-active' : ''}`}
                >
                  With Teleprompter
                </button>
                <button
                  onClick={() => setMode('memory')}
                  className={`mode-btn ${mode === 'memory' ? 'mode-btn-active' : ''}`}
                >
                  Without Looking
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="btn-primary w-full"
            >
              {loading ? 'GENERATING...' : 'GENERATE SCRIPT'}
            </button>

            {script && (
              <>
                <Teleprompter text={script} />
                <button onClick={handleContinue} className="btn-white w-full mt-6">
                  PROCEED TO RECORDING STUDIO →
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}