import { useEffect, useRef, useState } from 'react'

const API_BASE = 'http://127.0.0.1:8000'

export default function TalkingAvatar({ tutor, textToSpeak, autoPlay = false }) {
  const videoRef = useRef(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  const generateVideo = async (text) => {
    if (!text || !tutor) return
    setLoading(true)
    setError('')
    setVideoUrl(null)

    try {
      const res = await fetch(`${API_BASE}/avatar/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          tutor_id: tutor.id,
          photo_url: tutor.image
        })
      })
      const data = await res.json()

      if (data.status === 'success' && data.video_url) {
        setVideoUrl(data.video_url)
      } else {
        setError(data.message || 'Video generation failed')
      }
    } catch (e) {
      setError('Network error while generating video')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (textToSpeak && autoPlay) {
      generateVideo(textToSpeak)
    }
  }, [textToSpeak, autoPlay])

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [videoUrl])

  return (
    <div className="talking-avatar-wrap">
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          autoPlay
          playsInline
          className="talking-avatar-video"
          onPlay={() => setIsSpeaking(true)}
          onEnded={() => setIsSpeaking(false)}
          onPause={() => setIsSpeaking(false)}
        />
      ) : (
        <div className="talking-avatar-static">
          <img src={tutor.image} alt={tutor.name} className="talking-avatar-img" />
          {loading && (
            <div className="talking-avatar-overlay">
              <div className="talking-spinner" />
              <p className="talking-loading-text">Generating lipsync video...</p>
              <p className="talking-loading-hint">This takes 10-30 seconds</p>
            </div>
          )}
          {error && (
            <div className="talking-avatar-overlay talking-avatar-error">
              <p>{error}</p>
            </div>
          )}
        </div>
      )}

      {!videoUrl && !loading && (
        <button
          className="talking-generate-btn"
          onClick={() => generateVideo(textToSpeak || `Hello, I am ${tutor.name}. Ready to begin?`)}
        >
          🎬 Generate Lipsync Intro
        </button>
      )}
    </div>
  )
}