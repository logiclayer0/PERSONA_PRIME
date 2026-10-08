import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { registerUser, loginUser } from '../services/authService'
import { useAppStore } from '../store/useAppStore'

export default function AuthPage() {
  const [params] = useSearchParams()
  const mode = params.get('mode') === 'register' ? 'register' : 'login'
  const [form, setForm] = useState({ email: '', display_name: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setUser = useAppStore((s) => s.setUser)
  const setToken = useAppStore((s) => s.setToken)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = mode === 'register'
        ? await registerUser(form)
        : await loginUser({ email: form.email, password: form.password })
      setUser(data.user)
      setToken(data.access_token)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('showTutorModal', 'true')
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pp-auth-page">
      <div className="pp-auth-glow"></div>
      <Link to="/" className="pp-auth-brand">PERSONA PRIME<span> / </span>01</Link>
      <div className="pp-auth-layout">
        <div className="pp-auth-intro">
          <span className="pp-auth-kicker">YOUR PERSONAL DEVELOPMENT SYSTEM</span>
          <h1>{mode === 'register' ? <>Start with<br/><em>understanding.</em></> : <>Continue<br/><em>building.</em></>}</h1>
          <p>{mode === 'register' ? 'Create your profile and let Persona Prime turn your answers into a personalized direction for growth.' : 'Return to your Blueprint, practice sessions and progress.'}</p>
          <div className="pp-auth-flow"><span>DISCOVER</span><i></i><span>BLUEPRINT</span><i></i><span>PRACTICE</span></div>
        </div>

        <div className="pp-auth-card">
          <div className="pp-auth-card-top"><span>{mode === 'register' ? '01 / CREATE PROFILE' : '01 / SIGN IN'}</span><span>PERSONA PRIME</span></div>
          <h2>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2>
          <p className="pp-auth-subtitle">{mode === 'register' ? 'Your starting point for a more intentional future.' : 'Continue where you left off.'}</p>
          <form onSubmit={handleSubmit} className="pp-auth-form">
            {mode === 'register' && <input name="display_name" placeholder="Your name" value={form.display_name} onChange={handleChange} required className="input-field" />}
            <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required className="input-field" />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6} className="input-field" />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" disabled={loading} className="pp-auth-submit">{loading ? 'PLEASE WAIT...' : mode === 'register' ? 'CREATE PROFILE  ↗' : 'SIGN IN  ↗'}</button>
          </form>
          <p className="pp-auth-switch">{mode === 'register' ? 'Already have an account?' : 'New to Persona Prime?'} <Link to={`/auth?mode=${mode === 'register' ? 'login' : 'register'}`}>{mode === 'register' ? 'Sign in' : 'Create account'}</Link></p>
        </div>
      </div>
    </div>
  )
}