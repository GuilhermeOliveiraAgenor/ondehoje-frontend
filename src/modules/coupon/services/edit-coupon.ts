import { describe } from 'node:test'

import { api } from '@/lib/api'

interface EditCupomRequest {
  id: string
  name: string
  description: string
  expiresAt: Date
}

export async function editCoupon(data: EditCupomRequest) {
  const result = await api(`/coupons/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      expiresAt: data.expiresAt,
    }),
  })

  return result
}
