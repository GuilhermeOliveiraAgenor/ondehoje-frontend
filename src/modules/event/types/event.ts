import { Address } from '@/modules/address/types/address'
import { Category } from '@/modules/category/types/category'
import { Company } from '@/modules/company/types/company'

interface Event {
  id: string
  companyId: number
  addressId: number
  categoryId: number
  name: string
  slug: string
  description: string
  startDate: string
  endDate: string
  createdAt: string
  createdBy: number
  updatedAt: string
  updatedBy: number
  // Relações
  company: Company
  category: Category
  address: Address
  images: string[]
}

export type { Event }
