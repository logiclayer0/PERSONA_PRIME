import axios from 'axios'
import { API_BASE } from '../config'

const authApi = axios.create({ baseURL: API_BASE, timeout: 15000, headers: { 'Content-Type': 'application/json' } })
authApi.interceptors.request.use((config) => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = 'Bearer ' + token; return config })
export const registerUser = async (payload) => (await authApi.post('/auth/register', payload)).data
export const loginUser = async (payload) => (await authApi.post('/auth/login', payload)).data
export const getMe = async () => (await authApi.get('/auth/me')).data
export const updateReminder = async (payload) => (await authApi.post('/auth/reminder', payload)).data
export const updateProfile = async (payload) => (await authApi.post('/auth/profile', payload)).data
