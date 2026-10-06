import axios from 'axios'
import { API_BASE, WS_BASE } from '../config'

const api = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' } })
api.interceptors.request.use((config) => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = 'Bearer ' + token; return config })
export const generateScript = async (payload) => (await api.post('/script/generate', payload)).data
export const startSession = async (payload) => (await api.post('/analytics/start', payload)).data
export const endSession = async (sessionUuid) => (await api.post('/analytics/end/' + sessionUuid)).data
export const getReport = async (sessionUuid) => (await api.get('/analytics/report/' + sessionUuid)).data
export const getMe = async () => (await api.get('/auth/me')).data
export const updateReminder = async (payload) => (await api.post('/auth/reminder', payload)).data
export const updateProfile = async (payload) => (await api.post('/auth/profile', payload)).data

let ws = null, currentSessionUuid = null, messageHandler = null, wsConnected = false
export const connectVideoSocket = (sessionUuid, onMessage) => {
  currentSessionUuid = sessionUuid; messageHandler = onMessage
  if (ws && ws.readyState === WebSocket.OPEN) { ws.send('session:' + sessionUuid); return ws }
  if (ws && ws.readyState === WebSocket.CONNECTING) return ws
  const token = localStorage.getItem('token')
  ws = new WebSocket(WS_BASE + '/video/analyze' + (token ? '?token=' + encodeURIComponent(token) : ''))
  ws.onopen = () => { wsConnected = true; if (currentSessionUuid) ws.send('session:' + currentSessionUuid) }
  ws.onmessage = (event) => { try { if (messageHandler) messageHandler(JSON.parse(event.data)) } catch (e) { console.error('WS parse error:', e) } }
  ws.onerror = (err) => console.error('WS error:', err)
  ws.onclose = () => { wsConnected = false; ws = null }
  return ws
}
export const sendFrame = (blob) => new Promise((resolve) => {
  if (!ws || ws.readyState !== WebSocket.OPEN || !blob) return resolve(false)
  const reader = new FileReader(); reader.readAsDataURL(blob)
  reader.onloadend = () => { try { ws.send(reader.result); resolve(true) } catch (e) { console.error('Frame send error:', e); resolve(false) } }
})
export const isSocketReady = () => wsConnected && ws && ws.readyState === WebSocket.OPEN
export const closeSocket = () => { if (ws) { ws.onclose = null; ws.close(); ws = null }; wsConnected = false; currentSessionUuid = null; messageHandler = null }
export default api
