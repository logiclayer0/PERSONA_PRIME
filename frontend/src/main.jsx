import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { useAppStore } from './store/useAppStore'
import { getMe } from './services/authService'
import './index.css'

function Bootstrap() {
  const setUser = useAppStore((s) => s.setUser)
  const setToken = useAppStore((s) => s.setToken)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setBooting(false)
      return
    }
    setToken(token)
    getMe()
      .then((user) => setUser(user))
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
      })
      .finally(() => setBooting(false))
  }, [])

  if (booting) {
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
        Loading Persona Prime...
      </div>
    )
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Bootstrap />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)