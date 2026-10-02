import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const generateScript = async (payload) => {
  const res = await api.post('/script/generate', payload)
  return res.data
}

export const startSession = async (payload, userId = 1) => {
  const res = await api.post(`/analytics/start?user_id=${userId}`, payload)
  return res.data
}

export const endSession = async (sessionUuid, userId = 1) => {
  const res = await api.post(`/analytics/end/${sessionUuid}?user_id=${userId}`)
  return res.data
}

export const getReport = async (sessionUuid) => {
  const res = await api.get(`/analytics/report/${sessionUuid}`)
  return res.data
}

export const getMe = async () => {
  const res = await api.get('/auth/me')
  return res.data
}

export const updateReminder = async (payload) => {
  const res = await api.post('/auth/reminder', payload)
  return res.data
}

export const updateProfile = async (payload) => {
  const res = await api.post('/auth/profile', payload)
  return res.data
}

let ws = null
let currentSessionUuid = null
let messageHandler = null
let wsConnected = false

export const connectVideoSocket = (sessionUuid, onMessage) => {
  currentSessionUuid = sessionUuid
  messageHandler = onMessage

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(`session:${sessionUuid}`)
    return ws
  }

  if (ws && ws.readyState === WebSocket.CONNECTING) {
    return ws
  }

  ws = new WebSocket('ws://127.0.0.1:8000/video/analyze')

  ws.onopen = () => {
    wsConnected = true
    if (currentSessionUuid) {
      ws.send(`session:${currentSessionUuid}`)
    }
  }

  ws.onmessage = (event) => {
    try {
      if (messageHandler) {
        messageHandler(JSON.parse(event.data))
      }
    } catch (e) {
      console.error('WS parse error:', e)
    }
  }

  ws.onerror = (err) => console.error('WS error:', err)

  ws.onclose = () => {
    wsConnected = false
    ws = null
  }

  return ws
}

export const sendFrame = (blob) => {
  return new Promise((resolve) => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !blob) {
      return resolve(false)
    }
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      try {
        ws.send(reader.result)
        resolve(true)
      } catch (e) {
        console.error('Frame send error:', e)
        resolve(false)
      }
    }
  })
}

export const isSocketReady = () => wsConnected && ws && ws.readyState === WebSocket.OPEN

export const closeSocket = () => {
  if (ws) {
    ws.onclose = null
    ws.close()
    ws = null
    wsConnected = false
    currentSessionUuid = null
    messageHandler = null
  }
}

export default api