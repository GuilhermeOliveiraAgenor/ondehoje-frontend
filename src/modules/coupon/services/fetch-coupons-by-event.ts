import { api } from '@/lib/api'

import { Coupon } from '../types/coupon'

interface FetchCouponsByEventResponse {
  coupons: Coupon[]
}

export async function fetchCouponsByEvent(id: string) {
  const result = await api<FetchCouponsByEventResponse>(`/coupons/event/${id}`)

  return result
}
