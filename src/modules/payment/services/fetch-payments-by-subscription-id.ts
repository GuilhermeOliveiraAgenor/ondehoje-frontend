import { api } from '@/lib/api'
import { Subscription } from '@/modules/subscription/types/subscription'

import { Payment } from '../types/payment'

export interface FetchPaymentsBySubscriptionIdRequest {
  subscriptionId: Subscription['id']
}

interface FetchPaymentsBySubscriptionIdResponse {
  payments: Payment[]
}

export async function fetchPaymentsBySubscriptionId({
  subscriptionId,
}: FetchPaymentsBySubscriptionIdRequest) {
  const result = await api<FetchPaymentsBySubscriptionIdResponse>(
    `/payment/subscriptions/${subscriptionId}`,
  )

  return result
}
