import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import ReportCard from '../components/ReportCard'
import Model3DAvatar from '../components/Model3DAvatar'
import { useAppStore } from '../store/useAppStore'
import { getReport } from '../services/apiService'

export default function ReportCardPage() {
  const navigate = useNavigate()
  const sessionUuid = useAppStore((s) => s.sessionUuid)
  const tutor = useAppStore((s) => s.tutor) || { id: 'seraphina', name: 'Dr. Seraphina Vance', role: 'EMPATHETIC / ADAPTIVE' }
  const user = useAppStore((s) => s.user)
  const reset = useAppStore((s) => s.reset)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!sessionUuid) {
        setLoading(false)
        return
      }
      try {
        const data = await getReport(sessionUuid)
        setReport(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [sessionUuid])

  const isPending = !report || report.final_status === 'PENDING'

  return (
    <AppLayout>
      <div className="report-page-container">
        <div className="report-left">
          <div className="report-avatar-card">
            <Model3DAvatar tutorId={tutor.id} isSpeaking={false} size="large" />
            <div className="report-avatar-info">
              <h3 className="report-avatar-name">{tutor.name}</h3>
              <p className="report-avatar-role" style={{ color: tutor.color }}>{tutor.role}</p>
            </div>
          </div>
        </div>

        <div className="report-right">
          <h1 className="dashboard-greeting">Session Report</h1>
          <p className="dashboard-subtitle">Your performance breakdown</p>

          {loading && <p className="text-muted-c">Loading report...</p>}

          {!sessionUuid && !loading && (
            <div className="empty-state">
              <span className="empty-icon">📊</span>
              <h2 className="empty-title">No sessions yet</h2>
              <p className="empty-desc">
                Complete a practice session to see your detailed report.
              </p>
              <button onClick={() => navigate('/role')} className="btn-primary mt-6">
                Start First Session
              </button>
            </div>
          )}

          {report && isPending && (
            <div className="info-banner">
              <span className="info-icon">ℹ️</span>
              <div>
                <p className="info-title">This session hasn't been fully analyzed yet.</p>
                <p className="info-desc">
                  Next time: keep your camera on, click "Start Recording", and speak for at least 30 seconds.
                </p>
              </div>
            </div>
          )}

          {report && !isPending && <ReportCard report={report} user={user} />}

          {report && (
            <div className="report-actions">
              <button onClick={() => { reset(); navigate('/role') }} className="btn-primary">
                Practice Again
              </button>
              <button onClick={() => { reset(); navigate('/home') }} className="btn-ghost">
                Back Home
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}