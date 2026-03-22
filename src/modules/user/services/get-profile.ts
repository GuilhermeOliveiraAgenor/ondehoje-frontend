import { api } from '@/lib/api'

import { User } from '../types/user'

interface GetProfileResponse {
  client: User
}

export async function getProfile() {
  const result = await api<GetProfileResponse>('/me')

  return result
}
