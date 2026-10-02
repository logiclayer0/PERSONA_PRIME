import { sendAvatarRequest } from './apiService'

export const getTalkingAvatar = async (text, tutorId, photoUrl) => {
  return await sendAvatarRequest({ text, tutor_id: tutorId, photo_url: photoUrl })
}