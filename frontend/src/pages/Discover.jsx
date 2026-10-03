import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAppStore } from '../store/useAppStore'

const API_BASE = 'http://127.0.0.1:8000'

export default function Discover() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const [questions, setQuestions] = useState({ basic: [], personality: [] })
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [basicInfo, setBasicInfo] = useState({
    full_name: '', education_stream: '', education_level: '',
    institution: '', current_year: '', city: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const allQuestions = [
    ...(Array.isArray(questions.basic) ? questions.basic : []),
    ...(Array.isArray(questions.personality) ? questions.personality : [])
  ]
  const currentQuestion = allQuestions[step]
  const totalSteps = allQuestions.length
  const progress = totalSteps > 0 ? ((step / totalSteps) * 100).toFixed(0) : 0

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/discovery/questions`)
        if (!res.ok) {
          setError(`Backend error: ${res.status}. Check if /discovery route exists.`)
          return
        }
        const data = await res.json()
        setQuestions({
          basic: Array.isArray(data.basic) ? data.basic : [],
          personality: Array.isArray(data.personality) ? data.personality : []
        })
      } catch (e) {
        setError('Cannot connect to backend. Is it running?')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (user?.display_name) {
      setBasicInfo((prev) => ({ ...prev, full_name: prev.full_name || user.display_name }))
    }
  }, [user])

  const handleBasicChange = (id, value) => {
    setBasicInfo((prev) => ({ ...prev, [id]: value }))
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleComplete = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')

    try {
      const answerList = Object.keys(answers).map((key) => {
        const q = allQuestions.find((x) => x.id === key)
        return {
          question_id: key,
          question_text: q?.question || '',
          answer: answers[key]
        }
      })

      await fetch(`${API_BASE}/discovery/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          basic_info: basicInfo.full_name ? basicInfo : null,
          answers: answerList
        })
      })

      await fetch(`${API_BASE}/discovery/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      navigate('/blueprint')
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const isCurrentAnswered = () => {
    if (!currentQuestion) return false
    const val = answers[currentQuestion.id]
    if (currentQuestion.required && (!val || (typeof val === 'string' && val.trim() === ''))) return false
    return true
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="dashboard-container">
          <p className="text-muted-c">Loading questions...</p>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="dashboard-container">
          <div className="info-banner">
            <span className="info-icon">⚠️</span>
            <div>
              <p className="info-title">Could not load questions</p>
              <p className="info-desc">{error}</p>
              <p className="info-desc" style={{ marginTop: 8 }}>
                Make sure backend is running and <code>/discovery/questions</code> endpoint exists.
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!currentQuestion) {
    return (
      <AppLayout>
        <div className="dashboard-container">
          <p className="text-muted-c">No questions available. Please check backend.</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="discover-container">
        <div className="discover-progress-wrap">
          <div className="discover-progress-info">
            <span className="discover-step-label">Question {step + 1} of {totalSteps}</span>
            <span className="discover-progress-pct">{progress}%</span>
          </div>
          <div className="discover-progress-bar">
            <div className="discover-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="discover-card">
          <h2 className="discover-question">{currentQuestion.question}</h2>

          {currentQuestion.type === 'text' && (
            <input
              type="text"
              className="input-field discover-input"
              placeholder={currentQuestion.placeholder || 'Type your answer...'}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleBasicChange(currentQuestion.id, e.target.value)}
              autoFocus
            />
          )}

          {currentQuestion.type === 'mcq' && (
            <div className="discover-options">
              {currentQuestion.options.map((opt) => {
                const selected = answers[currentQuestion.id] === opt
                return (
                  <button
                    key={opt}
                    className={`discover-option ${selected ? 'discover-option-active' : ''}`}
                    onClick={() => handleAnswer(currentQuestion.id, opt)}
                  >
                    <span className="discover-option-dot" />
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
          )}

          <div className="discover-actions">
            <button
              className="btn-ghost"
              onClick={handleBack}
              disabled={step === 0}
            >
              ← Back
            </button>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!isCurrentAnswered() || saving}
            >
              {saving ? 'SAVING...' : step === totalSteps - 1 ? 'FINISH →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
