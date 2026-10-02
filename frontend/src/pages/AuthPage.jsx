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
    <div className="auth-page">
      <Link to="/" className="auth-logo">PERSONA_PRIME</Link>
      <div className="auth-card">
        <h2 className="auth-title">
          {mode === 'register' ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'register' ? 'Start your upgrade' : 'Continue your journey'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <input
              name="display_name"
              placeholder="Display Name"
              value={form.display_name}
              onChange={handleChange}
              required
              className="input-field"
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="input-field"
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'PLEASE WAIT...' : mode === 'register' ? 'REGISTER' : 'SIGN IN'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'register' ? 'Already have an account?' : 'New here?'}{' '}
          <Link to={`/auth?mode=${mode === 'register' ? 'login' : 'register'}`}>
            {mode === 'register' ? 'Sign In' : 'Create Account'}
          </Link>
        </p>
      </div>
    </div>
  )
}