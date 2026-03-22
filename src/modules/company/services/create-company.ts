import { api } from '@/lib/api'

interface CreateCompanyRequest {
  addressId: string
  name: string
  socialName: string
  document: string
  imagesIds: string[]
  documentsIds: string[]
  informations?: Array<{
    id?: string
    name: string
    description?: string | null
    phoneNumber?: string | null
    email?: string | null
  }>
}

export async function createCompany({
  addressId,
  name,
  socialName,
  document,
  imagesIds,
  documentsIds,
  informations,
}: CreateCompanyRequest) {
  const result = await api('/companies', {
    method: 'POST',
    body: JSON.stringify({
      addressId,
      name,
      socialName,
      document,
      imagesIds,
      documentsIds,
      informations,
    }),
  })

  return result
}
