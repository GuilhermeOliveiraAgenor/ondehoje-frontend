'use server'

import { getCurrentCompany } from '@/auth/auth'
import { fetchAdvertisementsByCompany } from '@/modules/advertisement/services/fetch-advertisements-by-company'

export async function getAdvertisementsByCompanyAction() {
  try {
    const slug = await getCurrentCompany()

    if (!slug) {
      return {
        success: false,
        data: [],
        error: 'Empresa não encontrada.',
      }
    }

    const { advertisements } = await fetchAdvertisementsByCompany(slug)

    return {
      success: true,
      data: advertisements,
    }
  } catch (error) {
    console.error('[GET_ADVERTISEMENTS_BY_COMPANY_ACTION_ERROR]', error)
    return {
      success: false,
      data: [],
      error: 'Falha ao buscar assinatura.',
    }
  }
}
