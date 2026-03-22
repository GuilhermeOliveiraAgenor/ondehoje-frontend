import { api } from '@/lib/api'

import { Advertisement } from '../types/advertisement'

interface FetchAdvertisementsByCompanyResponse {
  advertisements: Advertisement[]
}

export async function fetchAdvertisementsByCompany(slug: string) {
  const result = await api<FetchAdvertisementsByCompanyResponse>(
    `/advertisements/${slug}`,
  )

  return result
}
