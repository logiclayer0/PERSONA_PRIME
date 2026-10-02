import { create } from 'zustand'

const loadTutor = () => {
  try {
    const saved = localStorage.getItem('selectedTutor')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export const useAppStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  tutor: loadTutor(),
  category: null,
  contentMode: null,
  duration: 2,
  scriptText: '',
  sessionUuid: null,
  points: 0,
  streak: 0,
  liveVision: null,
  liveAudio: null,

  setUser: (user) => set({
    user,
    points: user?.points || 0,
    streak: user?.streak || 0
  }),
  setToken: (token) => set({ token }),
  setRole: (role) => set({ role }),
  setTutor: (tutor) => {
    if (tutor) {
      localStorage.setItem('selectedTutor', JSON.stringify(tutor))
    } else {
      localStorage.removeItem('selectedTutor')
    }
    set({ tutor })
  },
  setCategory: (category) => set({ category }),
  setContentMode: (contentMode) => set({ contentMode }),
  setDuration: (duration) => set({ duration }),
  setScriptText: (scriptText) => set({ scriptText }),
  setSessionUuid: (sessionUuid) => set({ sessionUuid }),
  setPoints: (points) => set({ points }),
  setStreak: (streak) => set({ streak }),
  setLiveVision: (liveVision) => set({ liveVision }),
  setLiveAudio: (liveAudio) => set({ liveAudio }),

  reset: () => set({
    role: null,
    category: null,
    contentMode: null,
    duration: 2,
    scriptText: '',
    sessionUuid: null,
    liveVision: null,
    liveAudio: null
  })
}))