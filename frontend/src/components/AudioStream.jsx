import { useState, useRef, useEffect } from 'react'

export default function AudioStream({ sessionUuid, onAudioMetrics }) {
  const [isRecording, setIsRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)

  const start = async () => {
    chunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      recorderRef.current = new MediaRecorder(stream)
      recorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
        await upload(blob)
      }
      recorderRef.current.start()
      setIsRecording(true)
    } catch {
      alert('Microphone permission required')
    }
  }

  const stop = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop()
      setIsRecording(false)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }

  const upload = async (blob) => {
    if (!sessionUuid) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', blob, 'voice_input.wav')
    formData.append('session_uuid', sessionUuid)

    try {
      const res = await fetch('http://localhost:8000/audio/analyze-file', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data && data.status === 'processed') {
        onAudioMetrics(data.audio_analysis)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="audio-panel">
      <h3 className="audio-title">Voice & Speech Analytics</h3>
      <p className="audio-hint">
        {isRecording
          ? 'Recording... speak clearly. Click stop when done.'
          : 'Click start and speak. Click stop to analyze.'}
      </p>
      <div className="audio-actions">
        {!isRecording ? (
          <button onClick={start} className="btn-audio-start">
            ● Start Recording
          </button>
        ) : (
          <button onClick={stop} className="btn-audio-stop">
            ■ Stop & Analyze
          </button>
        )}
        {loading && <span className="audio-loading">⚡ Processing...</span>}
      </div>
    </div>
  )
}