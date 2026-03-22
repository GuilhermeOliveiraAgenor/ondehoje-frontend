import { api } from '@/lib/api'

import { Address } from '../types/address'

interface FetchAddressResponse {
  address: Address[]
}

export async function fetchAddress() {
  const result = await api<FetchAddressResponse>('/address')

  return result
}
