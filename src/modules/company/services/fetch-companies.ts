import { api } from '@/lib/api'

import { CompanyDetails } from '../types/company-details'

interface FetchCompaniesRequest {
  latitude?: number
  longitude?: number
}

interface FetchCompaniesResponse {
  companies: CompanyDetails[]
}

export async function fetchCompanies({
  latitude,
  longitude,
}: FetchCompaniesRequest) {
  const result = await api<FetchCompaniesResponse>(
    `/companies?latitude=${latitude ?? 0}&longitude=${longitude ?? 0}`,
  )

  return result
}
