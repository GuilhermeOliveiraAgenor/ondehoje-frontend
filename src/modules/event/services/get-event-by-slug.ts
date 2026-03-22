import { api } from '@/lib/api'

import { EventDetails } from '../types/event-details'

interface GetEventBySlugResponse {
  event: EventDetails
}

export async function GetEventBySlug(slug: string) {
  const result = await api<GetEventBySlugResponse>(`/events/${slug}`)

  return result
}
