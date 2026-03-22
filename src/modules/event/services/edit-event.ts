import { api } from '@/lib/api'

interface EditEventRequest {
  id: string
  addressId?: string
  categoryId?: string
  name?: string
  description?: string
  startDate?: Date
  endDate?: Date
  informations?: Array<{
    id?: string
    name: string
    description?: string
    phoneNumber?: string
    email?: string
  }>
  imagesIds?: string[]
}

export async function editEvent(data: EditEventRequest) {
  const result = await api(`/events/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  return result
}
