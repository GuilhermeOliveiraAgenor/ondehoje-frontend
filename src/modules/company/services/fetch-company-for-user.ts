import { api } from '@/lib/api'

import { CompanyDetails } from '../types/company-details'

interface FetchCompaniesForUserRequest {
  latitude?: number
  longitude?: number
}

interface FetchCompaniesForUserResponse {
  companies: CompanyDetails[]
}

export async function fetchCompaniesForUser({
  latitude,
  longitude,
}: FetchCompaniesForUserRequest) {
  const result = await api<FetchCompaniesForUserResponse>(
    `/companies/dashboard/for-user?latitude=${latitude ?? 0}&longitude=${longitude ?? 0}`,
  )

  return result
}
