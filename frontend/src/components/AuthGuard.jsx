import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function AuthGuard({ children }) {
  const user = useAppStore((s) => s.user)
  const navigate = useNavigate()
  const location = useLocation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/auth', { replace: true })
      return
    }

    if (user) {
      setReady(true)
      return
    }

    const timer = setTimeout(() => {
      if (!useAppStore.getState().user) {
        setReady(true)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [user, navigate, location.pathname])

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-muted)',
        fontSize: '12px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase'
      }}>
        Loading...
      </div>
    )
  }

  return children
}