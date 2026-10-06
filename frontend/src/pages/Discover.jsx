import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { API_BASE } from '../config'
import { useAppStore } from '../store/useAppStore'

export default function Discover() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const [questions, setQuestions] = useState({
    basic: [], personality: [], stream_specific: [],
    case_based: [], interests: [], aspiration: []
  })
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [multiAnswers, setMultiAnswers] = useState({})
  const [basicInfo, setBasicInfo] = useState({
    full_name: '', education_stream: '', education_level: '',
    institution: '', current_year: '', city: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [streamLoaded, setStreamLoaded] = useState(false)

  const allQuestions = [
    ...(Array.isArray(questions.basic) ? questions.basic : []),
    ...(Array.isArray(questions.personality) ? questions.personality : []),
    ...(Array.isArray(questions.stream_specific) ? questions.stream_specific : []),
    ...(Array.isArray(questions.case_based) ? questions.case_based : []),
    ...(Array.isArray(questions.interests) ? questions.interests : []),
    ...(Array.isArray(questions.aspiration) ? questions.aspiration : [])
  ]

  const currentQuestion = allQuestions[step]
  const totalSteps = allQuestions.length
  const progress = totalSteps > 0 ? ((step / totalSteps) * 100).toFixed(0) : 0

  useEffect(() => {
    loadQuestions()
  }, [])

  useEffect(() => {
    if (basicInfo.education_stream && !streamLoaded) {
      loadQuestions(basicInfo.education_stream)
      setStreamLoaded(true)
    }
  }, [basicInfo.education_stream])

  useEffect(() => {
    if (user?.display_name) {
      setBasicInfo((prev) => ({ ...prev, full_name: prev.full_name || user.display_name }))
    }
  }, [user])

  const loadQuestions = async (stream = null) => {
    try {
      const token = localStorage.getItem('token')
      const url = stream
        ? `${API_BASE}/discovery/questions?stream=${encodeURIComponent(stream)}`
        : `${API_BASE}/discovery/questions`

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) {
        setError(`Backend error: ${res.status}`)
        return
      }
      const data = await res.json()
      setQuestions({
        basic: data.basic || [],
        personality: data.personality || [],
        stream_specific: data.stream_specific || [],
        case_based: data.case_based || [],
        interests: data.interests || [],
        aspiration: data.aspiration || []
      })
    } catch (e) {
      setError('Cannot connect to backend')
    } finally {
      setLoading(false)
    }
  }

  const handleTextChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    if (['full_name', 'education_stream', 'education_level', 'institution', 'current_year', 'city'].includes(id)) {
      setBasicInfo((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleMcq = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleMulti = (id, option) => {
    const current = multiAnswers[id] || []
    const updated = current.includes(option)
      ? current.filter((x) => x !== option)
      : [...current, option]
    setMultiAnswers((prev) => ({ ...prev, [id]: updated }))
    setAnswers((prev) => ({ ...prev, [id]: updated }))
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

      const interestsList = multiAnswers['interests_multi'] || []
      const skillsList = multiAnswers['skills_multi'] || []

      await fetch(`${API_BASE}/discovery/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          basic_info: basicInfo.full_name ? basicInfo : null,
          answers: answerList,
          interests: interestsList,
          skills: skillsList
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
    if (currentQuestion.type === 'multi') {
      return Array.isArray(val) && val.length > 0
    }
    if (currentQuestion.required) {
      return val && (typeof val !== 'string' || val.trim() !== '')
    }
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
          <p className="text-muted-c">No questions available.</p>
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
            <>
              <textarea
                className="input-field discover-input discover-textarea"
                placeholder={currentQuestion.placeholder || 'Type your answer...'}
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                rows={currentQuestion.id === 'aspiration_5year' || currentQuestion.id === 'aspiration_dream' ? 4 : 1}
              />
              {(currentQuestion.id === 'aspiration_5year' || currentQuestion.id === 'aspiration_dream') && (
                <p className="discover-hint">Be honest and specific. Your answers shape the assessment.</p>
              )}
            </>
          )}

          {currentQuestion.type === 'mcq' && (
            <div className="discover-options">
              {currentQuestion.options.map((opt) => {
                const selected = answers[currentQuestion.id] === opt
                return (
                  <button
                    key={opt}
                    className={`discover-option ${selected ? 'discover-option-active' : ''}`}
                    onClick={() => handleMcq(currentQuestion.id, opt)}
                  >
                    <span className="discover-option-dot" />
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
          )}

          {currentQuestion.type === 'multi' && (
            <div className="discover-options discover-options-multi">
              {currentQuestion.options.map((opt) => {
                const selected = (multiAnswers[currentQuestion.id] || []).includes(opt)
                return (
                  <button
                    key={opt}
                    className={`discover-option discover-option-multi ${selected ? 'discover-option-active' : ''}`}
                    onClick={() => handleMulti(currentQuestion.id, opt)}
                  >
                    <span className="discover-multi-check">{selected ? '✓' : ''}</span>
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
              Back
            </button>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!isCurrentAnswered() || saving}
            >
              {saving ? 'SAVING...' : step === totalSteps - 1 ? 'Complete Assessment' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
