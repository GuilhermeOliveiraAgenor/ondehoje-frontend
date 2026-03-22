import { api } from '@/lib/api'

import { EventDetails } from '../types/event-details'

interface FetchEventsByCompanyResponse {
  events: EventDetails[]
}

export async function fetchEventsByCompany(slug: string) {
  const result = await api<FetchEventsByCompanyResponse>(
    `/events/company/${slug}`,
  )

  return result
}
