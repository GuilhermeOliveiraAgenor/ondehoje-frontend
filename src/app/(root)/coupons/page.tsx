import { isAuthenticated } from '@/auth/auth'
import type { UserCoupon } from '@/modules/user-coupon/types/user-coupon'

import { fetchUserCouponsAction } from './actions'
import { UserCouponsList } from './user-coupons-list'

export default async function UserCouponsPage() {
  const authenticated = await isAuthenticated()

  const userCoupons: UserCoupon[] = []

  if (authenticated) {
    const { data } = await fetchUserCouponsAction()
    userCoupons.push(...data)
  }

  return (
    <UserCouponsList
      isAuthenticated={authenticated}
      userCoupons={userCoupons}
    />
  )
}
