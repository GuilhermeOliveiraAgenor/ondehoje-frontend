import { getParameterByKeyAction } from '@/modules/parameter/actions'

import { getEventsByCompanyAction } from '../events/actions'
import { getAdvertisementsByCompanyAction } from './actions'
import { AdvertisementsList } from './advertisements-list'

export default async function AdvertisementsPage() {
  const { data: advertisements } = await getAdvertisementsByCompanyAction()
  const { data: events } = await getEventsByCompanyAction()
  const { data: price } = await getParameterByKeyAction(
    'advertisement.base.daily.price',
  )
  const { data: discount } = await getParameterByKeyAction(
    'advertisement.discount.threshold.days',
  )
  const { data: percentage } = await getParameterByKeyAction(
    'advertisement.discount.percentage',
  )

  if (!price || !discount || !percentage) {
    return <div>Parâmetros de anúncio não configurados.</div>
  }

  return (
    <AdvertisementsList
      advertisements={advertisements}
      events={events}
      price={price}
      discount={discount}
      percentage={percentage}
    />
  )
}
