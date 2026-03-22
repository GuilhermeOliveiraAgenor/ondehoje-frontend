import { api } from '@/lib/api'

import { EventLocation } from '../types/event-location'

interface FetchEventsForUserRequest {
  latitude?: number
  longitude?: number
}

interface FetchEventsForUserResponse {
  events: EventLocation[]
}

export async function fetchEventsForUser({
  latitude,
  longitude,
}: FetchEventsForUserRequest) {
  const result = await api<FetchEventsForUserResponse>(
    `/events/dashboard/for-user?latitude=${latitude ?? 0}&longitude=${longitude ?? 0}`,
  )

  return result
}
