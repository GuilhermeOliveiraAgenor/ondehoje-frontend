import { api } from '@/lib/api'
import { Company } from '@/modules/company/types/company'

import { Advertisement } from '../types/advertisement'

interface FetchAdvertisementsByCompanyIdRequest {
  companyId: Company['id']
}

interface FetchAdvertisementsByCompanyIdResponse {
  advertisements: Advertisement[]
}

export async function fetchAdvertisementsByCompanyId({
  companyId,
}: FetchAdvertisementsByCompanyIdRequest) {
  const result = await api<FetchAdvertisementsByCompanyIdResponse>(
    `/advertisements/companies/${companyId}`,
  )

  return result
}
