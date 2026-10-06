import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function NotificationBar() {
  const user = useAppStore((s) => s.user)
  const streak = useAppStore((s) => s.streak)
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) return
    const hour = new Date().getHours()
    const key = `notif_shown_${new Date().toDateString()}`
    if (localStorage.getItem(key)) return

    if (hour >= 18 && streak === 0) {
      setMessage("Evening check-in: A quick 2-minute practice keeps your streak alive. Ready?")
      setShow(true)
    } else if (streak >= 3) {
      setMessage(`${streak}-day streak: Don't break the chain. Practice today?`)
      setShow(true)
    } else if (user.total_sessions === 0) {
      setMessage("Welcome to Persona Prime. Start your first session today.")
      setShow(true)
    }
  }, [user, streak])

  const dismiss = () => {
    setShow(false)
    localStorage.setItem(`notif_shown_${new Date().toDateString()}`, 'true')
  }

  if (!show) return null

  return (
    <div className="notif-bar">
      <span className="notif-msg">{message}</span>
      <button className="notif-close" onClick={dismiss}>✕</button>
    </div>
  )
}