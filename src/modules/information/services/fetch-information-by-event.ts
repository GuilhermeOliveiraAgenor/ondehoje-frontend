import { api } from '@/lib/api'

import { Information } from '../types/information'

interface FetchInformationByEventResponse {
  information: Information[]
}

export async function fetchInformationByEvent(id: string) {
  const result = await api<FetchInformationByEventResponse>(
    `/information/event/${id}`,
  )
  return result
}
