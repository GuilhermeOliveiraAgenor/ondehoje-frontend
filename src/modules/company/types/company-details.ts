import { Address } from '@/modules/address/types/address'
import { Document } from '@/modules/document/types/document'
import { Image } from '@/modules/image/types/image'
import { Information } from '@/modules/information/types/information'

import { Company } from './company'

interface CompanyDetails {
  id: Company['id']
  addressId: Company['id']
  name: Company['name']
  socialName: Company['socialName']
  slug: Company['slug']
  status: Company['status']
  document: Company['document']
  createdAt: Company['createdAt']
  updatedAt: Company['updatedAt']
  address: Address
  documents: Document[]
  images: Image[]
  informations: Information[]
  isFavorited: boolean
}

export type { CompanyDetails }
