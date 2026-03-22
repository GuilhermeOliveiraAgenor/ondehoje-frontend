import { getEventsByCompanyAction } from '../events/actions'
import { fetchCouponsByCompanyAction } from './actions'
import { CouponsList } from './coupon-list'

export default async function CouponsPage() {
  const { data: events } = await getEventsByCompanyAction()
  const { data: coupons } = await fetchCouponsByCompanyAction()
  return <CouponsList events={events} coupons={coupons} />
}
