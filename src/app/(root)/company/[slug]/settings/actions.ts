'use server'

import { getCurrentCompany } from '@/auth/auth'
import { getCompanyBySlug } from '@/modules/company/services/get-company-by-slug'

export async function getCompanyDetailsAction() {
  try {
    const companySlug = await getCurrentCompany()

    const { company } = await getCompanyBySlug(companySlug || '')

    return {
      success: true,
      data: company,
    }
  } catch (error) {
    console.error('[GET_COMPANY_DETAILS_ACTION_ERROR]', error)
    return {
      success: false,
      data: null,
      error: 'Falha ao buscar empresa.',
    }
  }
}
