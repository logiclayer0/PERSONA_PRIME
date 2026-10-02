import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { TUTORS } from '../data/tutors'
import ThemeToggle from './ThemeToggle'
import TutorModal from './TutorModal'

const NAV_ITEMS = [
  { path: '/home', label: 'Dashboard', icon: '🏠' },
  { path: '/role', label: 'Practice', icon: '🎯' },
  { path: '/report', label: 'Reports', icon: '📊' },
  { path: '/progress', label: 'Progress', icon: '📈' },
  { path: '/settings', label: 'Settings', icon: '⚙️' }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [tutorOpen, setTutorOpen] = useState(false)
  const user = useAppStore((s) => s.user)
  const points = useAppStore((s) => s.points)
  const streak = useAppStore((s) => s.streak)
  const tutor = useAppStore((s) => s.tutor)
  const navigate = useNavigate()

  const activeTutor = tutor || TUTORS[0]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('showTutorModal')
    localStorage.removeItem('selectedTutor')
    useAppStore.getState().reset()
    useAppStore.setState({ user: null, token: null, tutor: null })
    navigate('/')
  }

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-logo">P</span>
            {!collapsed && (
              <div>
                <p className="sidebar-brand-text">PERSONA</p>
                <p className="sidebar-brand-sub">PRIME</p>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {!collapsed && (
          <div
            className="sidebar-tutor-box"
            onClick={() => setTutorOpen(true)}
            style={{ borderColor: activeTutor.color + '66' }}
          >
            <div
              className="sidebar-tutor-avatar-letter"
              style={{
                background: `linear-gradient(135deg, ${activeTutor.color}, ${activeTutor.colorSoft})`,
                boxShadow: `0 0 16px ${activeTutor.bgGlow}`
              }}
            >
              {activeTutor.name.charAt(0)}
            </div>
            <div className="sidebar-tutor-info">
              <p className="sidebar-tutor-name">{activeTutor.name}</p>
              <p className="sidebar-tutor-tagline" style={{ color: activeTutor.color }}>
                {activeTutor.tagline}
              </p>
            </div>
            <span className="sidebar-tutor-change" style={{ color: activeTutor.color }}>
              ↻
            </span>
          </div>
        )}

        {!collapsed && user && (
          <div className="sidebar-profile">
            <div className="sidebar-avatar">{user.display_name?.[0]?.toUpperCase() || 'U'}</div>
            <div className="sidebar-profile-info">
              <p className="sidebar-profile-name">{user.display_name}</p>
              <p className="sidebar-profile-role">{user.role}</p>
            </div>
          </div>
        )}

        {!collapsed && (
          <div className="sidebar-stats">
            <div className="sidebar-stat">
              <span className="sidebar-stat-icon">🔥</span>
              <div>
                <p className="sidebar-stat-label">Streak</p>
                <p className="sidebar-stat-value">{streak} d</p>
              </div>
            </div>
            <div className="sidebar-stat">
              <span className="sidebar-stat-icon">⭐</span>
              <div>
                <p className="sidebar-stat-label">Points</p>
                <p className="sidebar-stat-value">{points}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              title={collapsed ? item.label : ''}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <ThemeToggle />
          {!collapsed && (
            <button className="sidebar-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </aside>

      <TutorModal
        open={tutorOpen}
        onClose={() => setTutorOpen(false)}
        firstTime={false}
      />
    </>
  )
}