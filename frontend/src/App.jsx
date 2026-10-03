import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import RoleSelection from './pages/RoleSelection'
import CategorySelection from './pages/CategorySelection'
import ContentSource from './pages/ContentSource'
import ScriptOptions from './pages/ScriptOptions'
import RecordingStudio from './pages/RecordingStudio'
import ReportCard from './pages/ReportCard'
import HomeDashboard from './pages/HomeDashboard'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import Discover from './pages/Discover'
import Blueprint from './pages/Blueprint'
import FloatingAvatar from './components/FloatingAvatar'
import AuthGuard from './components/AuthGuard'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<AuthGuard><HomeDashboard /></AuthGuard>} />
        <Route path="/role" element={<AuthGuard><RoleSelection /></AuthGuard>} />
        <Route path="/category" element={<AuthGuard><CategorySelection /></AuthGuard>} />
        <Route path="/source" element={<AuthGuard><ContentSource /></AuthGuard>} />
        <Route path="/script" element={<AuthGuard><ScriptOptions /></AuthGuard>} />
        <Route path="/studio" element={<AuthGuard><RecordingStudio /></AuthGuard>} />
        <Route path="/report" element={<AuthGuard><ReportCard /></AuthGuard>} />
        <Route path="/progress" element={<AuthGuard><Progress /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
        <Route path="/discover" element={<AuthGuard><Discover /></AuthGuard>} />
        <Route path="/blueprint" element={<AuthGuard><Blueprint /></AuthGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingAvatar />
    </>
  )
}
