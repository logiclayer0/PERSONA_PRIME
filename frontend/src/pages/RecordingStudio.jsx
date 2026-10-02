import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import WebcamStream from '../components/WebcamStream'
import AudioStream from '../components/AudioStream'
import Model3DAvatar from '../components/Model3DAvatar'
import Teleprompter from '../components/Teleprompter'
import LiveAnalysisPanel from '../components/LiveAnalysisPanel'
import { useAppStore } from '../store/useAppStore'
import { startSession, endSession, closeSocket } from '../services/apiService'

export default function RecordingStudio() {
  const navigate = useNavigate()
  const tutor = useAppStore((s) => s.tutor) || { id: 'seraphina', name: 'Dr. Seraphina Vance', welcomeText: 'Ready?' }
  const category = useAppStore((s) => s.category)
  const contentMode = useAppStore((s) => s.contentMode)
  const duration = useAppStore((s) => s.duration)
  const scriptText = useAppStore((s) => s.scriptText)
  const user = useAppStore((s) => s.user)
  const setSessionUuid = useAppStore((s) => s.setSessionUuid)
  const setPoints = useAppStore((s) => s.setPoints)
  const setStreak = useAppStore((s) => s.setStreak)
  const setUser = useAppStore((s) => s.setUser)
  const setLiveVision = useAppStore((s) => s.setLiveVision)
  const setLiveAudio = useAppStore((s) => s.setLiveAudio)

  const [sessionUuid, setLocalUuid] = useState(null)
  const [vision, setVision] = useState(null)
  const [audio, setAudio] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [error, setError] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [frameCount, setFrameCount] = useState(0)
  const timerRef = useRef(null)

  const handleVisionMetrics = useCallback((data) => {
    setVision(data)
    setLiveVision(data)
    setFrameCount((c) => c + 1)
  }, [setLiveVision])

  const handleAudioMetrics = useCallback((data) => {
    setAudio(data)
    setLiveAudio(data)
  }, [setLiveAudio])

  useEffect(() => {
    let mounted = true

    async function init() {
      if (!user?.id) {
        setError('Please login first')
        return
      }
      try {
        const res = await startSession({
          tutor_id: tutor?.id || 'seraphina',
          category: category || 'speech',
          content_mode: contentMode || 'own',
          duration_minutes: duration,
          script_text: scriptText || ''
        }, user.id)

        if (mounted) {
          setLocalUuid(res.session_uuid)
          setSessionUuid(res.session_uuid)
        }
      } catch (e) {
        console.error(e)
        if (mounted) setError('Failed to start session.')
      }
    }

    init()

    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)

    return () => {
      mounted = false
      if (timerRef.current) clearInterval(timerRef.current)
      closeSocket()
      setLiveVision(null)
      setLiveAudio(null)
    }
  }, [])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const triggerIntro = () => {
    if (!tutor || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(tutor.welcomeText || `Welcome. Let's begin.`)
    u.pitch = tutor.voicePitch
    u.rate = tutor.voiceRate
    u.onstart = () => setIsSpeaking(true)
    u.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(u)
  }

  const handleEndSession = async () => {
    if (!sessionUuid || isEnding) return
    setIsEnding(true)
    try {
      closeSocket()
      const res = await endSession(sessionUuid, user?.id || 1)
      if (res.user) {
        setPoints(res.user.points)
        setStreak(res.user.streak)
        const current = useAppStore.getState().user
        if (current) {
          setUser({
            ...current,
            points: res.user.points,
            streak: res.user.streak,
            total_sessions: res.user.total_sessions
          })
        }
      }
      navigate('/report')
    } catch (e) {
      console.error(e)
      setError('Failed to end session.')
    } finally {
      setIsEnding(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="studio-topbar">
          <div className="studio-timer">
            <span className="studio-timer-dot" />
            <span className="studio-timer-text">{formatTime(elapsed)}</span>
          </div>
          <div className="studio-meta">
            <span className="studio-meta-item">Frames: {frameCount}</span>
            <span className="studio-meta-item">{category || 'speech'}</span>
            <span className="studio-meta-item">{duration} min target</span>
          </div>
        </div>

        {error && <div className="studio-error">{error}</div>}

        <div className="studio-container">
          <div className="studio-left">
            <div className="surface-card studio-tutor-card">
              <h2 className="studio-tutor-name">{tutor?.name}</h2>
              <p className="studio-tutor-role" style={{ color: tutor?.color }}>{tutor?.role}</p>
              <div className="studio-avatar-wrap">
                <Model3DAvatar tutorId={tutor.id} isSpeaking={isSpeaking} size="large" />
              </div>
              <button onClick={triggerIntro} className="studio-intro-btn">
                Hear Tutor Intro
              </button>
            </div>

            {sessionUuid ? (
              <div className="surface-card studio-webcam-card">
                <WebcamStream sessionUuid={sessionUuid} onMetrics={handleVisionMetrics} />
              </div>
            ) : (
              <div className="surface-card studio-webcam-card studio-loading">
                <span>Initializing session...</span>
              </div>
            )}
          </div>

          <div className="studio-right">
            <LiveAnalysisPanel vision={vision} audio={audio} />

            {contentMode === 'ai' && scriptText && (
              <div className="studio-teleprompter">
                <p className="settings-label">Teleprompter</p>
                <Teleprompter text={scriptText} />
              </div>
            )}

            {sessionUuid && (
              <AudioStream sessionUuid={sessionUuid} onAudioMetrics={handleAudioMetrics} />
            )}

            <button
              onClick={handleEndSession}
              disabled={isEnding || !sessionUuid}
              className="btn-white w-full"
            >
              {isEnding ? 'ANALYZING...' : 'END SESSION & VIEW REPORT'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}