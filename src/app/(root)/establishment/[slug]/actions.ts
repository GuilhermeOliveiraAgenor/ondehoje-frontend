'use server'

import { fetchAdvertisementsByCompanyId } from '@/modules/advertisement/services/fetch-advertisements-by-company-id'
import { getCompanyBySlug } from '@/modules/company/services/get-company-by-slug'

export async function getCompanyAction(slug: string) {
  try {
    const { company } = await getCompanyBySlug(slug)

    return {
      success: true,
      data: company,
    }
  } catch (error) {
    console.error('[GET_COMPANY_ACTION_ERROR]', error)
    return {
      success: false,
      data: null,
      error: 'Falha ao buscar Estabelecimento.',
    }
  }
}

export async function fetchAdvertisementsByCompanyIdAction(companyId: string) {
  try {
    const { advertisements } = await fetchAdvertisementsByCompanyId({
      companyId,
    })

    return {
      success: true,
      data: advertisements,
    }
  } catch (error) {
    console.error('[FETCH_ADVERTISEMENTS_BY_COMPANY_ID_ACTION_ERROR]', error)

    return {
      success: false,
      data: [],
      error: 'Falha ao buscar anúncios.',
    }
  }
}
