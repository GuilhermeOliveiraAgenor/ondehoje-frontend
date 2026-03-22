import { api } from '@/lib/api'

import { Parameter } from '../types/parameter'

interface GetParameterByKeyResponse {
  parameter: Parameter | null
}

export async function getParameterByKey(key: string) {
  const result = await api<GetParameterByKeyResponse>(`/parameters/${key}`)

  return result
}
