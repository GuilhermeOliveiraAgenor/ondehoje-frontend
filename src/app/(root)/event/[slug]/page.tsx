import { notFound } from 'next/navigation'

import { defineAbilityForUser, isAuthenticated } from '@/auth/auth'

import {
  fetchAdvertisementsByEventIdAction,
  fetchCouponsByEventIdAction,
  getEventAction,
} from './actions'
import { EventDetails } from './event-details'

export default async function EventDetailsBySlugPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params

  const { data: event } = await getEventAction(slug)

  if (!event) {
    notFound()
  }

  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return <EventDetails event={event} coupons={[]} advertisements={[]} />
  }

  const { data: coupons } = await fetchCouponsByEventIdAction(event.id)

  const { data: advertisements } = await fetchAdvertisementsByEventIdAction(
    event.id,
  )

  const ability = await defineAbilityForUser()
  const canEvaluateAdvertisement = ability.can('evaluate:Advertisement')

  return (
    <EventDetails
      event={event}
      coupons={coupons}
      advertisements={advertisements}
      canEvaluateAdvertisement={canEvaluateAdvertisement}
    />
  )
}
