import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAppStore } from '../store/useAppStore'

const API_BASE = 'http://127.0.0.1:8000'

export default function Blueprint() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch(`${API_BASE}/discovery/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setProfile(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="dashboard-container">
          <p className="text-muted-c">Loading blueprint...</p>
        </div>
      </AppLayout>
    )
  }

  if (!profile || profile.status !== 'completed') {
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

  return (
    <AppLayout>
      <div className="dashboard-container">
        <h1 className="dashboard-greeting">Your Blueprint</h1>
        <p className="dashboard-subtitle">Personalized insights coming soon</p>

        <div className="blueprint-placeholder">
          <div className="blueprint-hero">
            <span className="blueprint-icon">🔮</span>
            <h2>Discovery Complete!</h2>
            <p>You answered <strong>{totalAnswered}</strong> questions.</p>
            <p className="blueprint-note">
              Your 5-year roadmap, personality analysis, and career blueprint
              will be generated here in the next phase.
            </p>
          </div>

          <div className="blueprint-preview">
            <h3>What's Coming</h3>
            <ul className="blueprint-list">
              <li>🧠 Personality Type Analysis</li>
              <li>🎯 Career Field Recommendations</li>
              <li>📅 5-Year Professional Roadmap</li>
              <li>⚡ Strengths & Weaknesses Breakdown</li>
              <li>🚀 Month-by-Month Action Plan</li>
              <li>💡 Personalized Skill Recommendations</li>
            </ul>
          </div>

          <button onClick={() => navigate('/discover')} className="btn-ghost">
            Retake Discovery
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
