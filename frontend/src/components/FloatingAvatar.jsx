import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import Model3DAvatar from './Model3DAvatar'
import AvatarChatPanel from './AvatarChatPanel'
import { TUTORS } from '../data/tutors'

export default function FloatingAvatar() {
  const location = useLocation()
  const tutor = useAppStore((s) => s.tutor) || TUTORS[0]
  const user = useAppStore((s) => s.user)
  const [chatOpen, setChatOpen] = useState(false)
  const isRecordingPage = location.pathname === '/studio'

  if (!user || isRecordingPage) return null

  const toggleChat = () => setChatOpen((open) => !open)

  return (
    <>
      <button className="floating-avatar floating-avatar-button" onClick={toggleChat} title={'Open ' + tutor.name + ' coach'} aria-label={'Open ' + tutor.name + ' coach'}>
        <div className="floating-avatar-model"><Model3DAvatar tutorId={tutor.id} isSpeaking={chatOpen} size="small" /><div className="floating-avatar-online" /></div>
      </button>
      <AvatarChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}
