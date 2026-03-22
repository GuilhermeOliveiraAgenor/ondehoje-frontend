import { api } from '@/lib/api'

import { Coupon } from '../types/coupon'

interface FetchCouponsByCompanyResponse {
  coupons: Coupon[]
}

export async function fetchCouponsByCompany(slug: string) {
  const result = await api<FetchCouponsByCompanyResponse>(
    `/coupons/company/${slug}`,
  )

  return result
}
