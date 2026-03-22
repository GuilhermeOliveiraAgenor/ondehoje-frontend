import { notFound } from 'next/navigation'

import { getPaymentByCheckoutIdAction } from './actions'
import { SuccessfulPage } from './successful'

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sessionId = (await searchParams).session_id as string

  const { data: payment } = await getPaymentByCheckoutIdAction(sessionId)

  if (!payment) {
    notFound()
  }

  return <SuccessfulPage payment={payment} />
}
