import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import Model3DAvatar from './Model3DAvatar'
import AvatarChatPanel from './AvatarChatPanel'
import { TUTORS } from '../data/tutors'

const API_BASE = 'http://127.0.0.1:8000'

const PAGE_LABELS = {
  '/home': 'Dashboard',
  '/role': 'Role Selection',
  '/category': 'Category Selection',
  '/source': 'Content Source',
  '/script': 'Script Generator',
  '/studio': 'Recording Studio',
  '/report': 'Session Report',
  '/progress': 'Progress',
  '/settings': 'Settings'
}

const PAGE_COMMENTS = {
  seraphina: {
    home: ["Welcome home.", "Nice to see you again.", "Shall we begin?"],
    role: ["Tell me about yourself.", "Who are you today?", "Pick your path."],
    category: ["Ooh, exciting choice.", "Good taste.", "Practice makes perfect."],
    source: ["Your words or mine?", "Own it or let me write.", "Both work."],
    script: ["Let's craft something lovely.", "Take your time.", "I'm here to help."],
    studio: ["Ready when you are.", "Deep breath in.", "You've got this."],
    report: ["Let's see how you did.", "I'm proud of you.", "Learning moment."],
    progress: ["Look how far you've come.", "Beautiful progress.", "So proud."],
    settings: ["Make it yours.", "Customize away.", "Set it how you like."],
    click: ["Lovely.", "That's nice.", "Perfect.", "Wonderful.", "I like it.", "Yes, do that."],
    idle: ["Still there?", "Take your time.", "No rush.", "Whenever you're ready."]
  },
  vladimir: {
    home: ["Report in.", "Back so soon?", "State your purpose."],
    role: ["Choose. Quickly.", "Who are you?", "Pick. No hesitation."],
    category: ["Sharp choice.", "Prove it.", "Show me."],
    source: ["Own it or mine?", "Decide now.", "Time's ticking."],
    script: ["Words matter.", "Make them count.", "Sharpen your tongue."],
    studio: ["Camera's on. Focus.", "No excuses.", "Show me what you got."],
    report: ["Results. Now.", "Let's see.", "Face the numbers."],
    progress: ["Improvement noted.", "Keep pace.", "No backsliding."],
    settings: ["Adjust. Move on.", "Configure.", "Fine."],
    click: ["Acceptable.", "Move.", "Good.", "Focus.", "Now next.", "Faster."],
    idle: ["Why idle?", "Time wasted.", "Move. Now.", "Don't stall."]
  },
  aurora: {
    home: ["Heyyy!", "WELCOME back!", "Missed you!"],
    role: ["Ooh who are you?", "Tell me tell me!", "Personality time!"],
    category: ["So fun!", "Great pick!", "Love it!"],
    source: ["Your words or mine?", "Spicy choice!", "Yesss!"],
    script: ["Let's write MAGIC!", "Words time!", "Creative mode ON!"],
    studio: ["Showtime!", "Let's GO!", "Camera ON, star!"],
    report: ["Let's see the magic!", "Scores time!", "Proud of you!"],
    progress: ["Look at you GROW!", "WOW progress!", "So cool!"],
    settings: ["Customize!", "Make it YOU!", "Fun stuff!"],
    click: ["Love it!", "WOO!", "Yesss!", "Boom!", "That's it!", "Fab!"],
    idle: ["Hellooo?", "Bored!", "Hellooooo!", "Anyone there?"]
  }
}

const pathToKey = (path) => {
  return Object.keys(PAGE_LABELS).includes(path) ? path.replace('/', '') : 'home'
}

export default function FloatingAvatar() {
  const location = useLocation()
  const tutor = useAppStore((s) => s.tutor) || TUTORS[0]
  const user = useAppStore((s) => s.user)

  const [chatOpen, setChatOpen] = useState(false)
  const [bubble, setBubble] = useState('')
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const lastCommentRef = useRef('')
  const lastClickTimeRef = useRef(0)
  const lastCommentTimeRef = useRef(0)
  const pathRef = useRef(location.pathname)
  const idleTimerRef = useRef(null)
  const commentIndexRef = useRef({})

  const isRecordingPage = location.pathname === '/studio'

  const pickComment = (category) => {
    const pool = PAGE_COMMENTS[tutor.id]?.[category] || PAGE_COMMENTS.seraphina[category]
    if (!pool) return ''
    const idx = commentIndexRef.current[`${tutor.id}-${category}`] || 0
    const comment = pool[idx % pool.length]
    commentIndexRef.current[`${tutor.id}-${category}`] = idx + 1
    return comment
  }

  const showComment = (text) => {
    if (!text) return
    if (text === lastCommentRef.current) return
    if (isRecordingPage) return

    lastCommentRef.current = text
    lastCommentTimeRef.current = Date.now()
    setBubble(text)
    setBubbleVisible(true)
    setIsSpeaking(true)
    setTimeout(() => setIsSpeaking(false), 1800)
    setTimeout(() => setBubbleVisible(false), 5000)
  }

  useEffect(() => {
    if (isRecordingPage) {
      setBubbleVisible(false)
      setIsSpeaking(false)
      window.speechSynthesis?.cancel()
      return
    }

    const introDelay = setTimeout(() => {
      const pageKey = pathToKey(location.pathname)
      showComment(pickComment(pageKey))
    }, 2000)

    const interval = setInterval(() => {
      if (Date.now() - lastCommentTimeRef.current > 25000) {
        const pageKey = pathToKey(location.pathname)
        showComment(pickComment(pageKey))
      }
    }, 25000)

    return () => {
      clearTimeout(introDelay)
      clearInterval(interval)
    }
  }, [tutor.id, user, location.pathname, isRecordingPage])

  useEffect(() => {
    if (location.pathname === pathRef.current) return
    pathRef.current = location.pathname

    if (isRecordingPage) {
      setBubbleVisible(false)
      window.speechSynthesis?.cancel()
      return
    }

    const timer = setTimeout(() => {
      const pageKey = pathToKey(location.pathname)
      showComment(pickComment(pageKey))
    }, 900)

    return () => clearTimeout(timer)
  }, [location.pathname, isRecordingPage])

  useEffect(() => {
    if (isRecordingPage) return

    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        if (!isRecordingPage) showComment(pickComment('idle'))
      }, 20000)
    }

    const handleActivity = () => resetIdle()
    resetIdle()

    window.addEventListener('mousemove', handleActivity, { passive: true })
    window.addEventListener('keydown', handleActivity, { passive: true })
    window.addEventListener('click', handleActivity, { passive: true })
    window.addEventListener('scroll', handleActivity, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [tutor.id, isRecordingPage])

  useEffect(() => {
    if (isRecordingPage) return

    const handleClick = (e) => {
      const target = e.target.closest('button, a, [role="button"]')
      if (!target) return

      const now = Date.now()
      if (now - lastClickTimeRef.current < 5000) return
      lastClickTimeRef.current = now

      showComment(pickComment('click'))
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [tutor.id, isRecordingPage])

  const toggleChat = () => {
    setChatOpen(!chatOpen)
    setBubbleVisible(false)
    window.speechSynthesis?.cancel()
  }

  if (!user) return null
  if (isRecordingPage) return null

  return (
    <>
      <div className="floating-avatar">
        {bubbleVisible && (
          <div className="floating-bubble-wrap">
            <div className="floating-bubble">
              <p>{bubble}</p>
            </div>
            <div className="floating-bubble-tail" />
          </div>
        )}
        <div
          className={`floating-avatar-model ${isSpeaking ? 'floating-avatar-speaking' : ''}`}
          onClick={toggleChat}
          title="Click to chat"
        >
          <Model3DAvatar tutorId={tutor.id} isSpeaking={isSpeaking} size="small" />
          <div className="floating-avatar-online" />
        </div>
      </div>

      <AvatarChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}