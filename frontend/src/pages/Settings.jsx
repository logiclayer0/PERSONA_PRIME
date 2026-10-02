import { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { useAppStore } from '../store/useAppStore'
import { useTheme } from '../context/ThemeContext'
import { updateReminder, updateProfile } from '../services/authService'

export default function Settings() {
  const user = useAppStore((s) => s.user)
  const setUser = useAppStore((s) => s.setUser)
  const { theme, setTheme } = useTheme()
  const [lang, setLang] = useState(user?.language || 'English')
  const [name, setName] = useState(user?.display_name || '')
  const [reminderEnabled, setReminderEnabled] = useState(user?.reminders_enabled ?? true)
  const [reminderTime, setReminderTime] = useState(user?.reminder_time || '19:00')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    try {
      const updated = await updateProfile({ display_name: name, language: lang })
      const reminder = await updateReminder({
        reminders_enabled: reminderEnabled,
        reminder_time: reminderTime
      })
      setUser({ ...updated, ...reminder })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <AppLayout>
      <div className="dashboard-container">
        <h1 className="dashboard-greeting">Settings</h1>
        <p className="dashboard-subtitle">Customize your experience</p>

        <div className="settings-section">
          <h2 className="section-title">Profile</h2>
          <div className="settings-row">
            <label className="settings-label">Display Name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="settings-row">
            <label className="settings-label">Email</label>
            <input className="input-field" value={user?.email || ''} disabled />
          </div>
          <div className="settings-row">
            <label className="settings-label">Language</label>
            <select className="input-field" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Appearance</h2>
          <div className="settings-row">
            <label className="settings-label">Theme</label>
            <select className="input-field" value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Reminders</h2>
          <div className="settings-row">
            <label className="settings-label">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Enable daily practice reminders
            </label>
          </div>
          <div className="settings-row">
            <label className="settings-label">Preferred Time</label>
            <input
              type="time"
              className="input-field"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary">
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
    </AppLayout>
  )
}