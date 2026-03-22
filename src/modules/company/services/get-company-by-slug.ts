import { api } from '@/lib/api'

import { CompanyDetails } from '../types/company-details'

interface GetCompanyBySlugResponse {
  company: CompanyDetails
}

export async function getCompanyBySlug(slug: string) {
  const result = await api<GetCompanyBySlugResponse>(`/companies/${slug}`)

  return result
}
