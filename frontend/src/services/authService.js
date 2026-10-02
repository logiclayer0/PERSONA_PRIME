import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000'

const authApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const registerUser = async (payload) => {
  const res = await authApi.post('/auth/register', payload)
  return res.data
}

export const loginUser = async (payload) => {
  const res = await authApi.post('/auth/login', payload)
  return res.data
}

export const getMe = async () => {
  const res = await authApi.get('/auth/me')
  return res.data
}

export const updateReminder = async (payload) => {
  const res = await authApi.post('/auth/reminder', payload)
  return res.data
}

export const updateProfile = async (payload) => {
  const res = await authApi.post('/auth/profile', payload)
  return res.data
}