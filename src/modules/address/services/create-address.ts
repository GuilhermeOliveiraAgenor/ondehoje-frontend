import { api } from '@/lib/api'

interface CreateAddressRequest {
  cep: string
  street: string
  neighborhood: string
  number: string
  state: string
  city: string
  complement?: string
  longitude: number
  latitude: number
}

export async function createAddress(data: CreateAddressRequest) {
  const result = await api('/address', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return result
}
