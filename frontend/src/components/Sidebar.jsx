import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { TUTORS } from '../data/tutors'
import TutorModal from './TutorModal'

const NAV_ITEMS = [
  { path: '/home', label: 'Dashboard' },
  { path: '/discover', label: 'Discover Yourself', featured: true },
  { path: '/role', label: 'Practice' },
  { path: '/progress', label: 'Progress' },
  { path: '/report', label: 'Reports' },
  { path: '/settings', label: 'Settings' }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [tutorOpen, setTutorOpen] = useState(false)
  const user = useAppStore((s) => s.user)
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
      <aside className={'sidebar ' + (collapsed ? 'sidebar-collapsed' : '')}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-logo">P</span>
            {!collapsed && <div><p className="sidebar-brand-text">PERSONA</p><p className="sidebar-brand-sub">PRIME</p></div>}
          </div>
          <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {!collapsed && (
          <button className="sidebar-tutor-box" onClick={() => setTutorOpen(true)} style={{ borderColor: activeTutor.color + '66' }}>
            <div className="sidebar-tutor-avatar-letter" style={{ background: 'linear-gradient(135deg, ' + activeTutor.color + ', ' + activeTutor.colorSoft + ')', boxShadow: '0 0 16px ' + activeTutor.bgGlow }}>
              {activeTutor.name.charAt(0)}
            </div>
            <div className="sidebar-tutor-info">
              <p className="sidebar-tutor-label">Current coach</p>
              <p className="sidebar-tutor-name">{activeTutor.name}</p>
            </div>
            <span className="sidebar-tutor-change">Change</span>
          </button>
        )}

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} to={item.path} title={collapsed ? item.label : ''} className={({ isActive }) => 'sidebar-link ' + (item.featured ? 'sidebar-link-featured ' : '') + (isActive ? 'sidebar-link-active' : '')}>
              <span className="sidebar-link-mark" aria-hidden="true" />
              {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && user && (
          <div className="sidebar-profile">
            <div className="sidebar-avatar">{user.display_name?.[0]?.toUpperCase() || 'U'}</div>
            <div className="sidebar-profile-info">
              <p className="sidebar-profile-name">{user.display_name}</p>
              <p className="sidebar-profile-role">{user.role}</p>
            </div>
          </div>
        )}

        <div className="sidebar-footer">
          {!collapsed && <button className="sidebar-logout" onClick={handleLogout}>Log out</button>}
        </div>
      </aside>
      <TutorModal open={tutorOpen} onClose={() => setTutorOpen(false)} firstTime={false} />
    </>
  )
}
