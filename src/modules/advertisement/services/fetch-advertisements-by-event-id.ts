import { api } from '@/lib/api'
import { Event } from '@/modules/event/types/event'

import { Advertisement } from '../types/advertisement'

interface FetchAdvertisementsByEventIdRequest {
  eventId: Event['id']
}

interface FetchAdvertisementsByEventIdResponse {
  advertisements: Advertisement[]
}

export async function fetchAdvertisementsByEventId({
  eventId,
}: FetchAdvertisementsByEventIdRequest) {
  const result = await api<FetchAdvertisementsByEventIdResponse>(
    `/advertisements/events/${eventId}`,
  )

  return result
}
