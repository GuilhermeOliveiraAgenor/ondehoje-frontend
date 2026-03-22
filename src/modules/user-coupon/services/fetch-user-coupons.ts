import { api } from '@/lib/api'

import { UserCoupon } from '../types/user-coupon'

interface FetchUserCouponsResponse {
  userCoupons: UserCoupon[]
}

export async function fetchUserCoupons() {
  const result = await api<FetchUserCouponsResponse>('/user-coupons')

  return result
}
