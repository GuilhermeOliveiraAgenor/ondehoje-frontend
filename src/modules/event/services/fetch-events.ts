import { api } from '@/lib/api'

import { EventLocation } from '../types/event-location'

interface FetchEventsRequest {
  latitude?: number
  longitude?: number
}

interface FetchEventsResponse {
  events: EventLocation[]
}

export async function fetchEvents({ latitude, longitude }: FetchEventsRequest) {
  const result = await api<FetchEventsResponse>(
    `/events?latitude=${latitude ?? 0}&longitude=${longitude ?? 0}`,
  )

  return result
}
