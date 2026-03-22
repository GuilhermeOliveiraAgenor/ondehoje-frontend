import { api } from '@/lib/api'

interface CreateCupomRequest {
  name: string
  description: string
  eventId: string
  expiresAt: Date
}

export async function createCoupon(data: CreateCupomRequest) {
  const result = await api('/coupons', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return result
}
