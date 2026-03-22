import { Coupon } from '@/modules/coupon/types/coupon'

interface UserCoupon {
  hash: string
  usedAt: string | null
  coupon: Coupon
}

export type { UserCoupon }
