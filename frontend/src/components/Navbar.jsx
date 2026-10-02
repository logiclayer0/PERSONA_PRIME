import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import ThemeToggle from './ThemeToggle'
import HelpModal from './HelpModal'

export default function Navbar() {
  const user = useAppStore((s) => s.user)
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <>
      <nav className="navbar-root">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <span className="brand-text">PERSONA_PRIME</span>
            <span className="brand-badge">Beta</span>
          </Link>

          <div className="navbar-actions">
            <button className="nav-help-btn" onClick={() => setHelpOpen(true)}>
              ? Help
            </button>
            {user ? (
              <>
                <div className="user-chip">
                  <span className="user-dot" />
                  <span className="user-name">{user.display_name}</span>
                </div>
                <Link to="/home" className="btn-nav-continue">Continue</Link>
              </>
            ) : (
              <>
                <Link to="/auth" className="nav-link">Sign In</Link>
                <Link to="/auth?mode=register" className="btn-nav-start">Get Started</Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}