import { api } from '@/lib/api'

import { PaymentDetails } from '../types/payment-details'

export interface GetPaymentByCheckoutIdRequest {
  checkoutId: PaymentDetails['checkoutId']
}

interface GetPaymentByCheckoutIdResponse {
  payment: PaymentDetails
}

export async function getPaymentByCheckoutId({
  checkoutId,
}: GetPaymentByCheckoutIdRequest) {
  const result = await api<GetPaymentByCheckoutIdResponse>(
    `/payment/by-checkout/${checkoutId}`,
  )

  return result
}
