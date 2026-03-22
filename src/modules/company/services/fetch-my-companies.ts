import { api } from '@/lib/api'

import { Company } from '../types/company'

interface FetchMyCompaniesResponse {
  companies: Company[]
}

export async function fetchMyCompanies() {
  const result = await api<FetchMyCompaniesResponse>('/companies/my')

  return result
}
