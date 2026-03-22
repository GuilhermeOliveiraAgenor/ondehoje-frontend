import { Advertisement } from '@/modules/advertisement/types/advertisement'
import { Subscription } from '@/modules/subscription/types/subscription'

import { Payment } from './payment'

interface PaymentDetails {
  subscription: Subscription | null
  advertisement: Advertisement | null
  gateway: Payment['gateway']
  checkoutId: Payment['checkoutId']
  amount: Payment['amount']
  tax: Payment['tax']
  status: Payment['status']
  link: Payment['link']
  method: Payment['method']
  pixData: Payment['pixData']
  finalCard: Payment['finalCard']
  confirmationDate: Payment['confirmationDate']
  expiresAt: Payment['expiresAt']
  createdAt: Payment['createdAt']
  updatedAt: Payment['updatedAt']
}

export type { PaymentDetails }
