import { useEffect, useRef, useState } from 'react'
import { connectVideoSocket, sendFrame, closeSocket } from '../services/apiService'

export default function WebcamStream({ sessionUuid, onMetrics }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const activeRef = useRef(false)
  const [status, setStatus] = useState('Initializing')

  useEffect(() => {
    if (!sessionUuid) return

    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, frameRate: { ideal: 15 } }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          activeRef.current = true
          setStatus('Camera Active')
        }
        connectVideoSocket(sessionUuid, (data) => onMetrics(data))
      } catch (err) {
        setStatus('Permission Denied')
      }
    }
    setup()

    const id = setInterval(() => {
      if (videoRef.current && canvasRef.current && activeRef.current) {
        const v = videoRef.current
        const c = canvasRef.current
        const ctx = c.getContext('2d')
        if (v.readyState >= 2) {
          ctx.drawImage(v, 0, 0, c.width, c.height)
          c.toBlob(async (blob) => {
            if (blob) await sendFrame(blob)
          }, 'image/jpeg', 0.7)
        }
      }
    }, 1000)

    return () => {
      clearInterval(id)
      activeRef.current = false
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop())
      }
      closeSocket()
    }
  }, [sessionUuid, onMetrics])

  return (
    <div className="webcam-wrap">
      <video ref={videoRef} autoPlay playsInline muted className="webcam-video" />
      <canvas ref={canvasRef} width="640" height="480" className="hidden-canvas" />
      <span className={`webcam-status ${status === 'Camera Active' ? 'webcam-status-ok' : 'webcam-status-err'}`}>
        {status}
      </span>
    </div>
  )
}