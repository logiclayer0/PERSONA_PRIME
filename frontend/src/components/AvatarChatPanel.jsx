import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

const API_BASE = 'http://127.0.0.1:8000'

const TUTOR_COLORS = {
  seraphina: '#5eead4',
  vladimir: '#e4e4e7',
  aurora: '#c084fc'
}

export default function AvatarChatPanel({ isOpen, onClose }) {
  const tutor = useAppStore((s) => s.tutor) || { id: 'seraphina', name: 'Seraphina' }
  const user = useAppStore((s) => s.user)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hi${user?.display_name ? ' ' + user.display_name : ''}! I'm ${tutor.name}. Ask me anything about your practice.`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/avatar/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutor_id: tutor.id,
          message: userMsg,
          history: messages.slice(-6)
        })
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', text: data.reply || "I'm here." }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Connection issue. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-info">
          <span className="chat-status-dot" style={{ background: TUTOR_COLORS[tutor.id] }} />
          <span className="chat-header-name">{tutor.name}</span>
        </div>
        <button className="chat-close" onClick={onClose}>✕</button>
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg chat-msg-${m.role}`}>
            <p>{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-msg chat-msg-assistant">
            <p className="chat-typing">...</p>
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${tutor.name}...`}
          disabled={loading}
        />
        <button className="chat-send" onClick={sendMessage} disabled={loading || !input.trim()}>
          ↑
        </button>
      </div>
    </div>
  )
}