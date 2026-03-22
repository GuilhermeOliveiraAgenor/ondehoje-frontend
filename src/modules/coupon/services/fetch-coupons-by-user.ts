import { api } from '@/lib/api'

import { Coupon } from '../types/coupon'

interface FetchCouponsByUserResponse {
  coupons: Coupon[]
}

export async function fetchCouponsByUser() {
  const result = await api<FetchCouponsByUserResponse>('/coupons')
  return result
}
