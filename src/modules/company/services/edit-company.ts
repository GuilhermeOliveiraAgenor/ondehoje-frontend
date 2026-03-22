import { api } from '@/lib/api'

interface EditCompanyRequest {
  id: string
  addressId: string
  name: string
  socialName: string
  document: string
  informations?: Array<{
    id?: string
    name: string
    description?: string
    phoneNumber?: string
    email?: string
  }>
  imagesIds?: string[]
  documentsIds?: string[]
}

export async function editCompany(data: EditCompanyRequest) {
  const result = await api(`/companies/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  return result
}
