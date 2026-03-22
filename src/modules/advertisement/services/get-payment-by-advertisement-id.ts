import { api } from '@/lib/api'
import { Payment } from '@/modules/payment/types/payment'

interface GetPaymentByAdvertisementIdResponse {
  payments: Payment[]
}

export async function getPaymentByAdvertisementId(advertisementId: string) {
  const result = await api<GetPaymentByAdvertisementIdResponse>(
    `/payment/advertisements/${advertisementId}`,
  )

  return result
}
