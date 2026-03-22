'use server'

import { api } from '@/lib/api'

interface CreateAdvertisementRequest {
  eventSlug?: string
  companySlug: string
  days: number
}

export async function createAdvertisement({
  eventSlug,
  companySlug,
  days,
}: CreateAdvertisementRequest) {
  await api('/advertisements', {
    method: 'POST',
    body: JSON.stringify({
      eventSlug,
      companySlug,
      description: '',
      days,
    }),
  })
}
