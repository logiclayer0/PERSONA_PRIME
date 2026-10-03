import { useState, useMemo } from 'react'
import PieChart from './PieChart'
import BarChart from './BarChart'
import RadarChart from './RadarChart'
import StreakCalendar from './StreakCalendar'
import TimelineReport from './TimelineReport'

const FUNNY_HEADLINES = {
  COMPLETE: [
    "You just made your old self jealous. 🔥",
    "Confidence: UNLOCKED. Keep going.",
    "That was smooth. Like butter on a hot pan.",
    "Boss mode activated. ✅"
  ],
  "NEEDS WORK": [
    "Not bad — but your potential is bigger than this.",
    "Rough edges. That's what practice is for.",
    "You showed up. Now let's polish the diamond.",
    "Close. Round 2 will be better."
  ],
  "NO DATA": [
    "Come back with the camera on — we need data!",
    "Session data incomplete. Try again properly."
  ],
  PENDING: [
    "Session data incomplete. Let's try again.",
    "Come back with the camera on — we need data!"
  ]
}

const ACHIEVEMENTS = (report, streak, points) => {
  const list = []
  if (report.final_status === 'COMPLETE') list.push({ icon: '🏆', label: 'Session Mastered', color: '#f59e0b' })
  if (report.confidence_score >= 70) list.push({ icon: '⭐', label: 'High Confidence', color: '#a855f7' })
  if (report.posture_pct >= 80) list.push({ icon: '🧘', label: 'Perfect Posture', color: '#10b981' })
  if (report.eye_pct >= 80) list.push({ icon: '👁️', label: 'Eye Contact Pro', color: '#3b82f6' })
  if (report.speech_pct >= 80) list.push({ icon: '🎤', label: 'Speech Star', color: '#ec4899' })
  if (report.grammar_pct >= 85) list.push({ icon: '📚', label: 'Grammar Guru', color: '#8b5cf6' })
  if (report.gesture_variety >= 3) list.push({ icon: '👋', label: 'Expressive Hands', color: '#14b8a6' })
  if (report.fillers === 0) list.push({ icon: '✨', label: 'Filler Free', color: '#06b6d4' })
  if (points >= 100) list.push({ icon: '💯', label: '100 Points Club', color: '#eab308' })
  if (streak >= 3) list.push({ icon: '🔥', label: '3-Day Streak', color: '#ef4444' })
  return list
}

export default function ReportCard({ report, user }) {
  if (!report) return null

  const [funnyPick] = useState(() => {
    const pool = FUNNY_HEADLINES[report.final_status] || FUNNY_HEADLINES.PENDING
    return pool[Math.floor(Math.random() * pool.length)]
  })

  const hasSession = report.final_status && report.final_status !== 'PENDING' && report.final_status !== 'NO DATA'

  const chartData = useMemo(() => {
    if (!hasSession) return []
    const items = []
    if (report.posture_pct > 0) items.push({ label: 'Posture', value: report.posture_pct, color: '#a855f7' })
    if (report.eye_pct > 0) items.push({ label: 'Eye', value: report.eye_pct, color: '#3b82f6' })
    if (report.gesture_pct > 0) items.push({ label: 'Gesture', value: report.gesture_pct, color: '#f59e0b' })
    if (report.speech_pct > 0) items.push({ label: 'Speech', value: report.speech_pct, color: '#10b981' })
    if (report.grammar_pct > 0) items.push({ label: 'Grammar', value: report.grammar_pct, color: '#8b5cf6' })
    return items
  }, [report, hasSession])

  const achievements = useMemo(() =>
    ACHIEVEMENTS(report, user?.streak || 0, user?.points || 0),
    [report, user]
  )

  const overall = report.confidence_score || 0
  const grade = overall >= 85 ? 'A+' : overall >= 70 ? 'A' : overall >= 55 ? 'B' : overall >= 40 ? 'C' : 'D'
  const gradeColor = overall >= 70 ? 'var(--success)' : overall >= 50 ? 'var(--warning)' : 'var(--error)'

  return (
    <div className="report-wrap">
      <div className="report-hero">
        <div className="report-hero-left">
          <div className={`report-status-chip report-status-${(report.final_status || 'pending').toLowerCase().replace(' ', '-')}`}>
            {report.final_status || 'PENDING'}
          </div>
          <h2 className="report-score-big">{overall}<span>%</span></h2>
          <p className="report-score-label">Confidence Score</p>
          {report.points_earned > 0 && (
            <p className="report-points-badge">+{report.points_earned} points earned</p>
          )}
        </div>
        <div className="report-hero-right">
          <div className="report-grade-circle" style={{ borderColor: gradeColor, color: gradeColor }}>
            <span className="report-grade-letter">{grade}</span>
            <span className="report-grade-label">Grade</span>
          </div>
          <p className="report-funny-line">{funnyPick}</p>
        </div>
      </div>

      {hasSession && achievements.length > 0 && (
        <div className="report-section">
          <h3 className="report-section-title">🏅 Achievements Unlocked</h3>
          <div className="achievements-grid">
            {achievements.map((a, i) => (
              <div key={i} className="achievement-badge" style={{ borderColor: a.color }}>
                <span className="achievement-icon">{a.icon}</span>
                <span className="achievement-label" style={{ color: a.color }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasSession && chartData.length > 0 && (
        <div className="report-charts-grid">
          <div className="report-chart-card">
            <h3 className="report-section-title">📊 Metric Breakdown</h3>
            <PieChart data={chartData} size={200} />
            <div className="report-legend">
              {chartData.map((d) => (
                <div key={d.label} className="legend-item">
                  <span className="legend-dot" style={{ background: d.color }} />
                  <span className="legend-label">{d.label}</span>
                  <span className="legend-value">{Math.round(d.value)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="report-chart-card">
            <h3 className="report-section-title">📈 Comparative View</h3>
            <BarChart data={chartData} height={220} />
          </div>

          {chartData.length >= 3 && (
            <div className="report-chart-card">
              <h3 className="report-section-title">🕸️ Confidence Web</h3>
              <RadarChart data={chartData} size={260} />
            </div>
          )}
        </div>
      )}

      <div className="report-section">
        <h3 className="report-section-title">📋 Detailed Metrics</h3>
        <div className="report-metrics-grid">
          <div className="report-metric report-metric-status">
            <p className="report-metric-label">Posture</p>
            <p className={`report-metric-value status-${(report.posture_status || 'no-data').toLowerCase().replace(' ', '-')}`}>
              {report.posture_status}
            </p>
            {report.posture_pct > 0 && <div className="metric-bar"><div className="metric-bar-fill" style={{ width: `${report.posture_pct}%`, background: '#a855f7' }} /></div>}
          </div>
          <div className="report-metric report-metric-status">
            <p className="report-metric-label">Eye Contact</p>
            <p className={`report-metric-value status-${(report.eye_contact_status || 'no-data').toLowerCase().replace(' ', '-')}`}>
              {report.eye_contact_status}
            </p>
            {report.eye_pct > 0 && <div className="metric-bar"><div className="metric-bar-fill" style={{ width: `${report.eye_pct}%`, background: '#3b82f6' }} /></div>}
          </div>
          <div className="report-metric report-metric-status">
            <p className="report-metric-label">Gesture</p>
            <p className={`report-metric-value status-${(report.gesture_status || 'no-data').toLowerCase().replace(' ', '-')}`}>
              {report.gesture_status}
            </p>
            {report.gesture_pct > 0 && <div className="metric-bar"><div className="metric-bar-fill" style={{ width: `${report.gesture_pct}%`, background: '#f59e0b' }} /></div>}
          </div>
          <div className="report-metric report-metric-status">
            <p className="report-metric-label">Speech</p>
            <p className={`report-metric-value status-${(report.speech_status || 'no-data').toLowerCase().replace(' ', '-')}`}>
              {report.speech_status}
            </p>
            {report.speech_pct > 0 && <div className="metric-bar"><div className="metric-bar-fill" style={{ width: `${report.speech_pct}%`, background: '#10b981' }} /></div>}
          </div>
          <div className="report-metric report-metric-status">
            <p className="report-metric-label">Grammar</p>
            <p className={`report-metric-value status-${(report.grammar_status || 'no-data').toLowerCase().replace(' ', '-')}`}>
              {report.grammar_status}
            </p>
            {report.grammar_pct > 0 && <div className="metric-bar"><div className="metric-bar-fill" style={{ width: `${report.grammar_pct}%`, background: '#8b5cf6' }} /></div>}
          </div>
        </div>
      </div>

      {hasSession && report.grammar_issues && report.grammar_issues.length > 0 && (
        <div className="report-section">
          <h3 className="report-section-title">📚 Grammar Insights</h3>
          <div className="grammar-issues-list">
            {report.grammar_issues.map((issue, i) => (
              <div key={i} className="grammar-issue">
                <div className="grammar-issue-original">❌ "{issue.found || issue.original}"</div>
                <div className="grammar-issue-correction">✅ "{issue.suggestion || issue.correction}"</div>
                <div className="grammar-issue-rule">💡 {issue.rule || issue.explanation}</div>
              </div>
            ))}
          </div>
          {report.grammar_feedback && (
            <p className="grammar-summary">{report.grammar_feedback}</p>
          )}
        </div>
      )}

      {hasSession && (
        <div className="report-section">
          <h3 className="report-section-title">👋 Gesture Analysis</h3>
          <div className="report-extra">
            <div className="report-extra-item">
              <span className="extra-label">Dominant Gesture</span>
              <span className="extra-value extra-value-sm">{report.dominant_gesture || 'Idle'}</span>
            </div>
            <div className="report-extra-item">
              <span className="extra-label">Gesture Variety</span>
              <span className="extra-value">{report.gesture_variety || 0}</span>
              <span className="extra-hint">
                {report.gesture_variety >= 3 ? '🎭 Expressive' : report.gesture_variety >= 1 ? '👍 Decent' : '😐 Static'}
              </span>
            </div>
            <div className="report-extra-item">
              <span className="extra-label">Nervous Signals</span>
              <span className="extra-value">{report.nervous_signals || 0}</span>
              <span className="extra-hint">
                {report.nervous_signals === 0 ? '✨ Calm' : report.nervous_signals < 5 ? '👍 Composed' : '⚠️ Anxious'}
              </span>
            </div>
          </div>
        </div>
      )}

      {report.wpm > 0 && (
        <div className="report-section">
          <h3 className="report-section-title">🗣️ Speech Analytics</h3>
          <div className="report-extra">
            <div className="report-extra-item">
              <span className="extra-label">Words / Minute</span>
              <span className="extra-value">{report.wpm}</span>
              <span className="extra-hint">{report.wpm < 110 ? '🐢 Too Slow' : report.wpm > 160 ? '⚡ Too Fast' : '✅ Perfect'}</span>
            </div>
            <div className="report-extra-item">
              <span className="extra-label">Filler Words</span>
              <span className="extra-value">{report.fillers || 0}</span>
              <span className="extra-hint">{report.fillers === 0 ? '✨ Filler Free!' : report.fillers <= 2 ? '👍 Good' : '⚠️ Reduce'}</span>
            </div>
            <div className="report-extra-item">
              <span className="extra-label">Pace</span>
              <span className="extra-value extra-value-sm">{report.pace || 'Unknown'}</span>
            </div>
          </div>
        </div>
      )}

      {user && (
        <div className="report-section">
          <h3 className="report-section-title">🔥 Your Streak</h3>
          <StreakCalendar streak={user.streak || 0} />
        </div>
      )}

      {report.ai_feedback && (
        <div className="report-section">
          <h3 className="report-section-title">💬 Coach's Note</h3>
          <div className="report-feedback">
            <pre className="report-feedback-body">{report.ai_feedback}</pre>
          </div>
        </div>
      )}

      {report.events && report.events.length > 0 && (
        <div className="report-section">
          <h3 className="report-section-title">⏱️ Session Timeline</h3>
          <TimelineReport events={report.events} />
        </div>
      )}
    </div>
  )
}
