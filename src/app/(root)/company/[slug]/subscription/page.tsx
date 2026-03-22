import { notFound } from 'next/navigation'

import { getParameterByKeyAction } from '@/modules/parameter/actions'

import {
  fetchPaymentsBySubscriptionIdAction,
  getSubscriptionByCompanySlugAction,
} from './actions'
import { SubscriptionForm } from './subscription-form'

export default async function SubscriptionPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params

  const { data: subscription } = await getSubscriptionByCompanySlugAction({
    slug,
  })

  const { data: price } = await getParameterByKeyAction('subscription.price')

  if (!subscription || !price) {
    notFound()
  }

  const { data: payments } = await fetchPaymentsBySubscriptionIdAction({
    subscriptionId: subscription.id,
  })

  return (
    <SubscriptionForm
      subscription={subscription}
      price={price}
      payments={payments}
    />
  )
}
