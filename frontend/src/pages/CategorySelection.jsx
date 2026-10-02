import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { CATEGORIES } from '../data/categories'
import { useAppStore } from '../store/useAppStore'

export default function CategorySelection() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()
  const setCategory = useAppStore((s) => s.setCategory)

  const handleContinue = () => {
    if (selected) {
      setCategory(selected)
      navigate('/source')
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="flow-container">
          <h1 className="flow-title">What are you practicing?</h1>
          <p className="flow-subtitle">Pick your arena</p>
          <div className="category-grid">
            {CATEGORIES.map((cat) => {
              const active = selected === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelected(cat.id)}
                  className={`category-card ${active ? 'category-card-active' : ''}`}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-label">{cat.label}</span>
                </button>
              )
            })}
          </div>
          <div className="flow-actions">
            <button disabled={!selected} onClick={handleContinue} className="btn-primary">
              Continue →
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}