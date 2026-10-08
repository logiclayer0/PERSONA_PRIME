const DEFAULT_PRODUCTION_API = 'https://persona-prime.onrender.com'
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? DEFAULT_PRODUCTION_API : 'http://127.0.0.1:8000')).replace(/\/$/, '')

export const API_BASE = API_BASE_URL
export const WS_BASE = API_BASE_URL.replace(/^http/, 'ws')
