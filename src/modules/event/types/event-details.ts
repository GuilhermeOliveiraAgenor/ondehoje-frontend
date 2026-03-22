import { Address } from '@/modules/address/types/address'
import { Category } from '@/modules/category/types/category'
import { CompanyDetails } from '@/modules/company/types/company-details'
import { Image } from '@/modules/image/types/image'
import { Information } from '@/modules/information/types/information'

interface EventDetails {
  id: string
  name: string
  slug: string
  description: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  company: CompanyDetails
  category: Category
  address: Address
  informations: Information[]
  images: Image[]
}

export type { EventDetails }
