import { api } from '@/lib/api'

interface SaveUserCouponRequest {
  couponId: string
}

export async function saveUserCoupon(data: SaveUserCouponRequest) {
  const result = await api(`/user-coupons/coupon/${data.couponId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return result
}
