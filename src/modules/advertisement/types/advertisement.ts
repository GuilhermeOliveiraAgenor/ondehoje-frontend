import { Company } from '@/modules/company/types/company'
import { Event } from '@/modules/event/types/event'

import { AdvertisementAuthorization } from './advertisement-authorization'

interface Advertisement {
  id: string
  company: Company
  event: Event | null
  description: string
  days: number
  amount: number
  clicks: number
  insights: number
  status: string
  expirationDate: string
  advertisementAuthorizations: AdvertisementAuthorization[]
  createdAt: string
  updatedAt: string
}

export type { Advertisement }
