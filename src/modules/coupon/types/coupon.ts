import { EventDetails } from '@/modules/event/types/event-details'

interface Coupon {
  id: string
  event: EventDetails
  name: string
  description: string
  expiresAt: string
  createdAt: string
  updatedAt: string
  isRedeemed: boolean
}

export type { Coupon }
