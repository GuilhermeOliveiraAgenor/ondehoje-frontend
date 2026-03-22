import { Address } from '@/modules/address/types/address'
import type { Category } from '@/modules/category/types/category'

interface EventLocation {
  id: string
  name: string
  slug: string
  description: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  address: {
    neighborhood: Address['neighborhood']
    city: Address['city']
    state: Address['state']
  }
  category: {
    name: Category['name']
  }
  company: {
    name: string
  }
  images: string[]
  isFavorited: boolean
}

export type { EventLocation }
