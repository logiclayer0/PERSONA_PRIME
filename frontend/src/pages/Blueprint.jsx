import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import PieChart from '../components/PieChart'
import RadarChart from '../components/RadarChart'

const API_BASE = 'http://127.0.0.1:8000'

export default function Blueprint() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [extraNotes, setExtraNotes] = useState('')
  const [showExtra, setShowExtra] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/discovery/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setProfile(data)

      if (data.roadmap_generated === 1) {
        await loadRoadmap()
      }
    } catch (e) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const loadRoadmap = async () => {
    try {
      const res = await fetch(`${API_BASE}/discovery/roadmap`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setRoadmap(data.roadmap)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const generateRoadmap = async (extra = '') => {
    setGenerating(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/discovery/generate-roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ extra_notes: extra })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Failed to generate roadmap')
        return
      }

      setRoadmap(data.roadmap)
      await loadProfile()
    } catch (e) {
      setError('Network error while generating roadmap')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="dashboard-container">
          <p className="text-muted-c">Loading blueprint...</p>
        </div>
      </AppLayout>
    )
  }

  if (!profile || profile.status === 'in_progress') {
    return (
      <AppLayout>
        <div className="dashboard-container">
          <div className="empty-state">
            <span className="empty-icon">🔮</span>
            <h2 className="empty-title">No blueprint yet</h2>
            <p className="empty-desc">
              Complete the Discover Yourself quiz to unlock your personalized blueprint.
            </p>
            <button onClick={() => navigate('/discover')} className="btn-primary mt-6">
              Start Discovery
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  const answers = JSON.parse(profile.answers || '{}')
  const totalAnswered = Object.keys(answers).length

  if (!roadmap) {
    return (
      <AppLayout>
        <div className="dashboard-container">
          <div className="blueprint-intro">
            <span className="blueprint-intro-icon">🔮</span>
            <h1 className="blueprint-intro-title">Discovery Complete</h1>
            <p className="blueprint-intro-desc">
              You answered <strong>{totalAnswered}</strong> questions.
              Now let's generate your personalized 5-year blueprint.
            </p>

            {error && (
              <div className="info-banner" style={{ marginTop: 24 }}>
                <span className="info-icon">⚠️</span>
                <div>
                  <p className="info-title">Error</p>
                  <p className="info-desc">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => generateRoadmap()}
              disabled={generating}
              className="btn-primary blueprint-generate-btn"
            >
              {generating ? '✨ ANALYZING YOUR PROFILE...' : '✨ GENERATE MY BLUEPRINT'}
            </button>

            {generating && (
              <p className="blueprint-generating-note">
                This takes 15-30 seconds. We're analyzing your personality, interests, and aspirations.
              </p>
            )}
          </div>
        </div>
      </AppLayout>
    )
  }

  const traits = roadmap.personality_traits || {}
  const traitData = [
    { label: 'Social', value: traits.extraversion || 0, color: '#a855f7' },
    { label: 'Confidence', value: traits.confidence || 0, color: '#10b981' },
    { label: 'Resilience', value: traits.resilience || 0, color: '#3b82f6' },
    { label: 'Leadership', value: traits.leadership || 0, color: '#f59e0b' },
    { label: 'Risk', value: traits.risk || 0, color: '#ec4899' },
    { label: 'Decision', value: traits.decision_making || 0, color: '#8b5cf6' }
  ]

  const careerData = (roadmap.career_fields || []).map((c, i) => ({
    label: c.field.split(' ')[0],
    value: c.match,
    color: ['#a855f7', '#3b82f6', '#10b981'][i] || '#a855f7'
  }))

  return (
    <AppLayout>
      <div className="dashboard-container">
        <div className="blueprint-header">
          <h1 className="dashboard-greeting">Your Blueprint</h1>
          <p className="dashboard-subtitle">
            Personalized analysis for {profile.full_name || 'you'}
          </p>
        </div>

        <div className="blueprint-hero-card">
          <div className="blueprint-hero-left">
            <p className="blueprint-label">Personality Type</p>
            <h2 className="blueprint-type">{roadmap.personality_type}</h2>
            <p className="blueprint-summary">{roadmap.summary}</p>
          </div>
          <div className="blueprint-hero-right">
            <div className="blueprint-score-circle">
              <span className="blueprint-score-value">{roadmap.confidence_score}</span>
              <span className="blueprint-score-label">Confidence</span>
            </div>
          </div>
        </div>

        <div className="blueprint-section">
          <h3 className="blueprint-section-title">🧠 Personality Analysis</h3>
          <p className="blueprint-text">{roadmap.personality_analysis}</p>
        </div>

        <div className="blueprint-charts-grid">
          <div className="blueprint-chart-card">
            <h3 className="blueprint-section-title">Traits Radar</h3>
            <RadarChart data={traitData} size={280} />
          </div>
          <div className="blueprint-chart-card">
            <h3 className="blueprint-section-title">Career Match</h3>
            <PieChart data={careerData} size={200} />
            <div className="report-legend" style={{ marginTop: 16 }}>
              {careerData.map((d) => (
                <div key={d.label} className="legend-item">
                  <span className="legend-dot" style={{ background: d.color }} />
                  <span className="legend-label">{d.label}</span>
                  <span className="legend-value">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="blueprint-two-col">
          <div className="blueprint-section">
            <h3 className="blueprint-section-title">✅ Strengths</h3>
            <ul className="blueprint-list-clean">
              {(roadmap.strengths || []).map((s, i) => (
                <li key={i} className="blueprint-list-item-success">{s}</li>
              ))}
            </ul>
          </div>
          <div className="blueprint-section">
            <h3 className="blueprint-section-title">⚠️ Weaknesses</h3>
            <ul className="blueprint-list-clean">
              {(roadmap.weaknesses || []).map((w, i) => (
                <li key={i} className="blueprint-list-item-warn">{w}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="blueprint-section">
          <h3 className="blueprint-section-title">🎯 Career Recommendations</h3>
          <div className="career-cards">
            {(roadmap.career_fields || []).map((c, i) => (
              <div key={i} className="career-card">
                <div className="career-card-header">
                  <h4 className="career-field-name">{c.field}</h4>
                  <span className="career-match">{c.match}% match</span>
                </div>
                <p className="career-why">{c.why}</p>
                <div className="career-bar">
                  <div className="career-bar-fill" style={{ width: `${c.match}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="blueprint-section">
          <h3 className="blueprint-section-title">🗺️ 5-Year Roadmap</h3>
          <div className="roadmap-timeline">
            {(roadmap.roadmap_5_year || []).map((year, i) => (
              <div key={i} className="roadmap-year">
                <div className="roadmap-year-header">
                  <span className="roadmap-year-num">{year.year}</span>
                  <span className="roadmap-year-theme">{year.theme}</span>
                </div>
                <div className="roadmap-year-body">
                  <div className="roadmap-year-col">
                    <p className="roadmap-col-label">Goals</p>
                    <ul>
                      {(year.goals || []).map((g, j) => (
                        <li key={j}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="roadmap-year-col">
                    <p className="roadmap-col-label">Skills</p>
                    <ul>
                      {(year.skills || []).map((s, j) => (
                        <li key={j}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="blueprint-section blueprint-brutal">
          <h3 className="blueprint-section-title">💥 Brutal Honesty</h3>
          <p className="blueprint-brutal-text">{roadmap.brutal_honesty}</p>
        </div>

        <div className="blueprint-two-col">
          <div className="blueprint-section">
            <h3 className="blueprint-section-title">👍 Pros</h3>
            <ul className="blueprint-list-clean">
              {(roadmap.pros || []).map((p, i) => (
                <li key={i} className="blueprint-list-item-success">{p}</li>
              ))}
            </ul>
          </div>
          <div className="blueprint-section">
            <h3 className="blueprint-section-title">👎 Cons</h3>
            <ul className="blueprint-list-clean">
              {(roadmap.cons || []).map((c, i) => (
                <li key={i} className="blueprint-list-item-warn">{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="blueprint-section">
          <h3 className="blueprint-section-title">⚡ Immediate Actions (Next 30 Days)</h3>
          <ol className="blueprint-actions-list">
            {(roadmap.immediate_actions || []).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ol>
        </div>

        <div className="blueprint-footer-actions">
          <button
            className="btn-ghost"
            onClick={() => setShowExtra(!showExtra)}
          >
            ✏️ Add More About Myself
          </button>
          <button
            className="btn-primary"
            onClick={() => generateRoadmap()}
            disabled={generating}
          >
            {generating ? 'RE-GENERATING...' : '🔄 Regenerate Blueprint'}
          </button>
        </div>

        {showExtra && (
          <div className="blueprint-extra-box">
            <h3 className="blueprint-section-title">Add More Context</h3>
            <p className="blueprint-extra-desc">
              Write anything you want us to consider — hidden interests, past experiences,
              family background, specific dreams, or anything else.
            </p>
            <textarea
              className="input-field blueprint-textarea"
              placeholder="Example: I've always wanted to work in animation. I did a small project in class 8. My family wants me to do engineering but I'm not sure. I love drawing..."
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              rows={6}
            />
            <button
              className="btn-primary"
              onClick={() => {
                generateRoadmap(extraNotes)
                setShowExtra(false)
              }}
              disabled={!extraNotes.trim() || generating}
            >
              {generating ? 'REGENERATING...' : 'REGENERATE WITH THIS CONTEXT'}
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
