import { api } from '@/lib/api'

interface CreateEventRequest {
  companySlug: string
  addressId: string
  categoryId: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  imagesIds: string[]
  informations?: Array<{
    id?: string
    name: string
    description?: string
    phoneNumber?: string | null
    email?: string | null
  }>
}

export async function createEvent(data: CreateEventRequest) {
  const result = await api('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return result
}
