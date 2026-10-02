import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAppStore } from '../store/useAppStore'

const ROLES = [
  { id: 'student', label: 'Student', desc: 'School or university learner', icon: '🎓' },
  { id: 'teacher', label: 'Teacher', desc: 'Educator or trainer', icon: '📚' },
  { id: 'employee', label: 'Employee', desc: 'Working professional', icon: '💼' },
  { id: 'executive', label: 'Executive', desc: 'Senior leadership', icon: '👔' },
  { id: 'parent', label: 'Parent', desc: 'Guiding your child', icon: '👨‍👩‍👧' },
  { id: 'other', label: 'Other', desc: 'Something else', icon: '✨' }
]

export default function RoleSelection() {
  const navigate = useNavigate()
  const setRole = useAppStore((s) => s.setRole)
  const tutor = useAppStore((s) => s.tutor)

  const handlePick = (id) => {
    setRole(id)
    if (!tutor) {
      navigate('/home')
      return
    }
    navigate('/category')
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="flow-container">
          <h1 className="flow-title">Who are you?</h1>
          <p className="flow-subtitle">We personalize your training</p>
          <div className="role-grid">
            {ROLES.map((r) => (
              <button key={r.id} onClick={() => handlePick(r.id)} className="role-card">
                <span className="role-icon">{r.icon}</span>
                <h3 className="role-label">{r.label}</h3>
                <p className="role-desc">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}