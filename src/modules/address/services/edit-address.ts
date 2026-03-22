import { api } from '@/lib/api'

interface UpdateAddressRequest {
  id: string
  cep?: string
  street?: string
  neighborhood?: string
  number?: string
  state?: string
  city?: string
  complement?: string
  longitude?: number
  latitude?: number
}

export async function editAddress(data: UpdateAddressRequest) {
  const result = await api(`/address/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  return result
}
