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
  const [activeYear, setActiveYear] = useState(0)

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

  const downloadPDF = async () => {
    try {
      const res = await fetch(`${API_BASE}/discovery/export-pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) {
        alert('PDF export failed. Make sure reportlab is installed.')
        return
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `persona_prime_blueprint.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (e) {
      alert('Failed to download PDF')
    }
  }

  const shareBlueprint = (platform) => {
    const text = `I just got my personalized 5-year career blueprint from Persona Prime! Personality: ${roadmap.personality_type}. 🚀`
    const url = window.location.href

    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${text} ${url}`)
      alert('Link copied to clipboard!')
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
              Now let's generate your deep, personalized 5-year blueprint.
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
              {generating ? '✨ ANALYZING YOUR PROFILE...' : '✨ GENERATE MY DEEP BLUEPRINT'}
            </button>

            {generating && (
              <p className="blueprint-generating-note">
                This takes 20-40 seconds. We're building your deep analysis with books, resources, roadmap, and more.
              </p>
            )}
          </div>
        </div>
      </AppLayout>
    )
  }

  const traits = roadmap.personality_traits || {}
  const traitData = Object.keys(traits).map((key, i) => ({
    label: key.replace('_', ' ').slice(0, 10),
    value: traits[key],
    color: ['#a855f7', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'][i % 8]
  }))

  const careerData = (roadmap.career_fields || []).map((c, i) => ({
    label: c.field.split(' ')[0],
    value: c.match,
    color: ['#a855f7', '#3b82f6', '#10b981'][i] || '#a855f7'
  }))

  const years = roadmap.roadmap_5_year || []

  return (
    <AppLayout>
      <div className="dashboard-container">
        <div className="blueprint-header">
          <div>
            <h1 className="dashboard-greeting">Your Blueprint</h1>
            <p className="dashboard-subtitle">Deep analysis for {profile.full_name || 'you'}</p>
          </div>
          <div className="blueprint-header-actions">
            <button className="btn-ghost" onClick={downloadPDF}>📄 PDF</button>
            <button className="btn-ghost" onClick={() => shareBlueprint('linkedin')}>🔗 LinkedIn</button>
            <button className="btn-ghost" onClick={() => shareBlueprint('twitter')}>🐦 Twitter</button>
            <button className="btn-ghost" onClick={() => shareBlueprint('copy')}>📋 Copy</button>
          </div>
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
            <RadarChart data={traitData} size={300} />
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
                <div className="career-meta">
                  <span className="career-meta-item">💰 {c.salary_range}</span>
                  <span className="career-meta-item">📈 {c.growth}</span>
                  <span className="career-meta-item">⚡ {c.difficulty}</span>
                </div>
                <div className="career-bar">
                  <div className="career-bar-fill" style={{ width: `${c.match}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="blueprint-section">
          <h3 className="blueprint-section-title">🗺️ 5-Year Roadmap</h3>

          <div className="roadmap-tabs">
            {years.map((y, i) => (
              <button
                key={i}
                className={`roadmap-tab ${activeYear === i ? 'roadmap-tab-active' : ''}`}
                onClick={() => setActiveYear(i)}
              >
                {y.year}
              </button>
            ))}
          </div>

          {years[activeYear] && (
            <div className="roadmap-year-detail">
              <div className="roadmap-year-hero">
                <h4 className="roadmap-year-theme-lg">{years[activeYear].theme}</h4>
                {years[activeYear].weekly_plan && (
                  <p className="roadmap-weekly">{years[activeYear].weekly_plan}</p>
                )}
              </div>

              <div className="roadmap-detail-grid">
                <div className="roadmap-detail-col">
                  <p className="roadmap-col-label">Goals</p>
                  <ul>
                    {(years[activeYear].goals || []).map((g, j) => (
                      <li key={j}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="roadmap-detail-col">
                  <p className="roadmap-col-label">Skills</p>
                  <ul>
                    {(years[activeYear].skills || []).map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="roadmap-detail-col">
                  <p className="roadmap-col-label">Milestones</p>
                  <ul>
                    {(years[activeYear].milestones || []).map((m, j) => (
                      <li key={j}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {roadmap.resources && (
          <div className="blueprint-section">
            <h3 className="blueprint-section-title">📚 Recommended Resources</h3>

            <div className="resource-category">
              <h4 className="resource-cat-title">📖 Books</h4>
              <div className="resource-grid">
                {(roadmap.resources.books || []).map((b, i) => (
                  <div key={i} className="resource-card">
                    <p className="resource-name">{b.title}</p>
                    <p className="resource-author">by {b.author}</p>
                    <p className="resource-why">{b.why}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="resource-category">
              <h4 className="resource-cat-title">📺 YouTube Channels</h4>
              <div className="resource-grid">
                {(roadmap.resources.youtube_channels || []).map((y, i) => (
                  <div key={i} className="resource-card">
                    <p className="resource-name">{y.name}</p>
                    <p className="resource-why">{y.topic}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="resource-category">
              <h4 className="resource-cat-title">🎓 Online Courses</h4>
              <div className="resource-grid">
                {(roadmap.resources.online_courses || []).map((c, i) => (
                  <div key={i} className="resource-card">
                    <p className="resource-name">{c.course}</p>
                    <p className="resource-author">on {c.platform}</p>
                    <p className="resource-why">{c.why}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
          <h3 className="blueprint-section-title">⚡ Immediate Actions</h3>
          <div className="action-grid">
            {(roadmap.immediate_actions || []).map((a, i) => {
              const action = typeof a === 'object' ? a.action : a
              const deadline = typeof a === 'object' ? a.deadline : ''
              return (
                <div key={i} className="action-card">
                  <p className="action-text">{action}</p>
                  {deadline && <p className="action-deadline">{deadline}</p>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="blueprint-section">
          <h3 className="blueprint-section-title">🚫 Common Mistakes to Avoid</h3>
          <ul className="blueprint-list-clean">
            {(roadmap.common_mistakes || []).map((m, i) => (
              <li key={i} className="blueprint-list-item-error">{m}</li>
            ))}
          </ul>
        </div>

        <div className="blueprint-two-col">
          <div className="blueprint-section">
            <h3 className="blueprint-section-title">🧘 Mentor Advice</h3>
            <p className="blueprint-text">{roadmap.mentor_advice}</p>
          </div>
          <div className="blueprint-section">
            <h3 className="blueprint-section-title">💰 Financial Planning</h3>
            <p className="blueprint-text">{roadmap.financial_planning}</p>
          </div>
        </div>

        <div className="blueprint-section">
          <h3 className="blueprint-section-title">🛟 Backup Plan</h3>
          <p className="blueprint-text">{roadmap.backup_plan}</p>
        </div>

        <div className="blueprint-section">
          <h3 className="blueprint-section-title">🎤 Interview Prep Tips</h3>
          <ul className="blueprint-list-clean">
            {(roadmap.interview_prep || []).map((i, idx) => (
              <li key={idx} className="blueprint-list-item-info">{i}</li>
            ))}
          </ul>
        </div>

        <div className="blueprint-section">
          <h3 className="blueprint-section-title">🌅 Daily Habits</h3>
          <ul className="blueprint-list-clean">
            {(roadmap.daily_habits || []).map((h, i) => (
              <li key={i} className="blueprint-list-item-success">{h}</li>
            ))}
          </ul>
        </div>

        <div className="blueprint-footer-actions">
          <button className="btn-ghost" onClick={() => setShowExtra(!showExtra)}>
            ✏️ Add More About Myself
          </button>
          <button
            className="btn-primary"
            onClick={() => generateRoadmap()}
            disabled={generating}
          >
            {generating ? 'RE-GENERATING...' : '🔄 Regenerate Blueprint'}
          </button>
          <button className="btn-ghost" onClick={() => navigate('/discover')}>
            🔁 Retake Discovery
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
              placeholder="Example: I've always wanted to work in animation. I did a small project in class 8. My family wants me to do engineering but I'm not sure..."
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
